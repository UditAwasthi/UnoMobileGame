<div align="center">

# 🃏 UNO Multiplayer

**A full-stack real-time UNO card game for iOS & Android**

Built by [@UditAwasthi](https://github.com/UditAwasthi)

![React Native](https://img.shields.io/badge/React_Native-Mobile-61DAFB?style=flat-square&logo=react)
![Express](https://img.shields.io/badge/Express-Gateway-000000?style=flat-square&logo=express)
![GraphQL](https://img.shields.io/badge/GraphQL-API-E10098?style=flat-square&logo=graphql)
![Redis](https://img.shields.io/badge/Redis-Cache_&_PubSub-DC382D?style=flat-square&logo=redis)
![Kafka](https://img.shields.io/badge/Kafka-Event_Bus-231F20?style=flat-square&logo=apachekafka)
![gRPC](https://img.shields.io/badge/gRPC-Inter_Service-244c5a?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)

</div>

---

## What is this?

A production-architecture UNO multiplayer game designed to be learned from as much as played. Every backend technology in this stack — Express, GraphQL, Redis, Kafka, gRPC, WebSockets, PostgreSQL — has a deliberate, real purpose. Nothing is added for show. The goal is to understand how modern backend systems are actually built by seeing each concept solve a real problem inside a game you know.

---

## System Architecture

```
React Native (iOS / Android)
         │
         ├── HTTP/GraphQL ──────────► Express API Gateway
         │                                    │
         └── WebSocket ─────────────► WebSocket Server
                                              │
                             ┌────────────────┴────────────────┐
                     GraphQL Server                     Redis Pub/Sub
                             │                                  │
                    ┌────────┴────────────────────────────┐     │
                    │           gRPC Bus                  │     │
           ┌────────┴──────┐ ┌──────────┐ ┌──────────┐ ┌─┴─────┴───┐
           │ Game service  │ │  Room    │ │  Card    │ │  Notif    │
           │               │ │ service  │ │ service  │ │  service  │
           └───────┬───────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘
                   └──────────────┴─────────────┴─────────────┘
                                        │
                               Apache Kafka
                          (game.events · card.played
                           player.joined · turn.changed)
                                        │
                          ┌─────────────┴──────────────┐
                     PostgreSQL                      Redis Cache
                   (source of truth)           (live state · sessions
                                                    leaderboard)
```

---

## How the System Works

### 1. A Player Opens the App

The React Native client launches and immediately authenticates with the **Express API Gateway**. Express validates the JWT token, identifies the player, and allows the session through. Rate limiting is applied here globally — no player can spam requests or card plays beyond a configured threshold.

From this point, the client opens **two connections** simultaneously: an HTTP connection for data queries and mutations via GraphQL, and a persistent **WebSocket connection** for receiving real-time game events.

---

### 2. Creating or Joining a Room

When a player taps "Create Room" or "Find Match", the GraphQL mutation hits the **Room Service** via gRPC. The Room Service handles all lobby lifecycle logic — it creates a room record, assigns a unique game ID, tracks how many players have joined, and manages the waiting state until the minimum player count is reached.

Once enough players join, the Room Service emits a `player.joined` event to **Kafka**, signalling all downstream systems that a new game session is forming.

---

### 3. The Game Starts — Cards Are Dealt

The **Game Service** consumes the Kafka event and initialises a new game state. It calls the **Card Service** over gRPC to generate a full shuffled UNO deck (108 cards), distribute 7 cards to each player's hand, place the first card on the discard pile, and establish the draw pile.

This entire game state — hands, draw pile, discard pile, turn order, direction — is immediately written to **Redis** as a hash with a TTL. Every read during active gameplay comes from Redis, not PostgreSQL. This is what makes the game feel instant.

---

### 4. A Player Plays a Card

This is the critical path. When a player taps a card:

1. The React Native client sends a `playCard` GraphQL **mutation** to Express.
2. Express routes it to the GraphQL server, which calls the **Game Service** via gRPC.
3. The Game Service validates the move — is it the player's turn? Does the card match the current colour or value? Is it a special card (Skip, Reverse, Draw Two, Wild)?
4. If valid, the game state in **Redis** is atomically updated.
5. The Game Service publishes a `card.played` event to **Kafka**.
6. A Kafka consumer picks up the event and writes it to **PostgreSQL** asynchronously — the game never waits on this.
7. Another Kafka consumer triggers the **Redis Pub/Sub** publisher on the channel `game:{gameId}`.
8. The **WebSocket Server** is subscribed to that Redis channel. It broadcasts the new game state to all connected players in the room.
9. Every player's screen updates in real time — they see the card played, the new top of the discard pile, and whose turn it is.

---

### 5. Special Cards and Game Events

Special UNO cards each have their own logic inside the Game Service state machine:

- **Skip** — advances the turn pointer by two.
- **Reverse** — flips the direction flag; with two players it behaves like Skip.
- **Draw Two** — the next player draws two cards from the draw pile and loses their turn. If the draw pile is empty, the discard pile (minus the top card) is shuffled and reused.
- **Wild** — the current player chooses a new active colour. The chosen colour is stored in game state.
- **Wild Draw Four** — combines a Wild with forcing the next player to draw four. Can only legally be played when the player has no other matching card.

Each of these emits its own Kafka event so the full game history is immutably recorded.

---

### 6. Calling UNO

When a player is down to their last card, they must call UNO before playing it. If they forget and another player challenges them first, they draw two penalty cards. The Game Service tracks a `calledUno` flag per player in Redis. The WebSocket layer broadcasts the UNO call so all clients can display the alert.

---

### 7. Disconnections and Reconnections

Players drop. Mobile networks switch. The system handles this gracefully. When a WebSocket disconnects, the player is marked inactive in Redis but the game continues with a countdown timer. If the player reconnects within the grace period, the WebSocket server reattaches them to the same Redis Pub/Sub channel, replays the current state from Redis, and they're back in the game. If they don't reconnect in time, the game skips their turn automatically. A push notification via the **Notification Service** is sent through FCM (Android) and APNs (iOS) prompting them to rejoin.

---

### 8. Game Ends

When a player plays their last card, the Game Service publishes a `match.result` event to Kafka. This triggers:

- **PostgreSQL write** — final scores, winner, game duration, card play history all persisted.
- **Redis update** — the leaderboard sorted set is updated with `ZADD` commands.
- **Notification** — all players receive a push notification with the result.
- **Redis cleanup** — the game state hash is deleted to free memory.

---

## Technology Roles at a Glance

| Technology | Role in UNO | Concept you learn |
|---|---|---|
| **Express** | API gateway, JWT auth, rate limiting | Middleware chains, REST routing |
| **GraphQL** | Flexible client queries, real-time subscriptions | Schema design, resolvers, DataLoader |
| **WebSocket** | Push live game events to players | Persistent connections, rooms, broadcasting |
| **Redis Cache** | Store live game state between turns | Hashes, TTL, atomic operations |
| **Redis Pub/Sub** | Bridge game services to WebSocket layer | Publisher/subscriber decoupling |
| **Redis Sorted Sets** | Real-time leaderboard | `ZADD`, `ZRANGE`, ranking patterns |
| **Kafka** | Event bus for all game actions | Topics, producers, consumers, consumer groups |
| **gRPC** | Fast inter-service calls (validate card, deal hand) | Protocol Buffers, service contracts |
| **PostgreSQL** | Persist players, games, card history, scores | Schema design, indexing, async writes |
| **React Native** | Cross-platform mobile game UI | Socket hooks, Redux, GraphQL client |

---

## Project Structure

```
uno-multiplayer/
├── apps/
│   └── mobile/                  # React Native client
│       ├── src/
│       │   ├── screens/         # Lobby, Game, Results
│       │   ├── components/      # Card, Hand, Board, UnoButton
│       │   ├── store/           # Redux slices
│       │   ├── hooks/           # useSocket, useGameState
│       │   └── graphql/         # Queries, mutations, subscriptions
│       └── package.json
│
├── services/
│   ├── gateway/                 # Express API gateway
│   │   ├── src/
│   │   │   ├── middleware/      # auth, rateLimit, validate
│   │   │   ├── routes/          # REST endpoints
│   │   │   └── graphql/         # Schema, resolvers
│   │   └── package.json
│   │
│   ├── game/                    # Game state service
│   │   ├── src/
│   │   │   ├── engine/          # Turn logic, card rules, state machine
│   │   │   ├── kafka/           # Producers and consumers
│   │   │   └── grpc/            # gRPC server definition
│   │   └── package.json
│   │
│   ├── room/                    # Room & matchmaking service
│   ├── card/                    # Deck & card validation service
│   └── notification/            # FCM & APNs push service
│
├── shared/
│   ├── proto/                   # .proto files for gRPC contracts
│   ├── types/                   # Shared TypeScript types
│   └── events/                  # Kafka event type definitions
│
├── infra/
│   ├── docker-compose.yml       # Local dev environment
│   ├── kafka/                   # Topic configuration
│   └── postgres/                # Migration files
│
└── README.md
```

---

## Data Flow Summary

```
Player action (mobile)
    → Express (auth + validate)
    → GraphQL mutation
    → gRPC call to Game Service
    → Game Service validates + updates Redis
    → Kafka event published
        → Consumer A: write to PostgreSQL
        → Consumer B: publish to Redis Pub/Sub channel
            → WebSocket server receives
            → Broadcasts to all room sockets
    → All players see update in real time
```

---

## Prerequisites

Make sure the following are installed on your machine before setting up the project.

- Node.js v20+
- Docker and Docker Compose
- React Native development environment ([React Native CLI setup guide](https://reactnative.dev/docs/environment-setup))
- Xcode (for iOS) or Android Studio (for Android)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/UditAwasthi/uno-multiplayer.git
cd uno-multiplayer
```

### 2. Start all infrastructure services

This brings up PostgreSQL, Redis, Kafka, and Zookeeper locally via Docker.

```bash
docker-compose -f infra/docker-compose.yml up -d
```

### 3. Create Kafka topics

```bash
docker exec -it kafka kafka-topics.sh --create --topic game.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
docker exec -it kafka kafka-topics.sh --create --topic card.played --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
docker exec -it kafka kafka-topics.sh --create --topic player.joined --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
docker exec -it kafka kafka-topics.sh --create --topic match.result --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
```

### 4. Run database migrations

```bash
cd infra/postgres
npx node-pg-migrate up
```

### 5. Set up environment variables

Copy the example env file in each service and fill in your values.

```bash
cp services/gateway/.env.example services/gateway/.env
cp services/game/.env.example services/game/.env
cp services/room/.env.example services/room/.env
cp services/card/.env.example services/card/.env
cp services/notification/.env.example services/notification/.env
```

### 6. Install dependencies for all services

```bash
# From the project root
npm install --workspaces
```

### 7. Start all backend services

```bash
# In separate terminals, or use a process manager like pm2 / concurrently
npm run dev --workspace=services/gateway
npm run dev --workspace=services/game
npm run dev --workspace=services/room
npm run dev --workspace=services/card
npm run dev --workspace=services/notification
```

### 8. Start the mobile app

```bash
cd apps/mobile
npm install
npx react-native start

# In a separate terminal:
npx react-native run-ios      # for iOS
npx react-native run-android  # for Android
```

---

## Default Ports

| Service | Port |
|---|---|
| Express API Gateway | 4000 |
| GraphQL Playground | 4000/graphql |
| WebSocket Server | 4001 |
| Game Service (gRPC) | 50051 |
| Room Service (gRPC) | 50052 |
| Card Service (gRPC) | 50053 |
| Notification Service (gRPC) | 50054 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Kafka | 9092 |
| Zookeeper | 2181 |

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `KAFKA_BROKER` | Kafka broker address |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `FCM_SERVER_KEY` | Firebase Cloud Messaging key |
| `APNS_KEY_PATH` | Path to APNs certificate |
| `GAME_SERVICE_GRPC_HOST` | Game service gRPC address |
| `CARD_SERVICE_GRPC_HOST` | Card service gRPC address |
| `ROOM_SERVICE_GRPC_HOST` | Room service gRPC address |

---

## Author

**Udit Awasthi** — [@UditAwasthi](https://github.com/UditAwasthi)

Built to learn full backend engineering by building something worth playing.
