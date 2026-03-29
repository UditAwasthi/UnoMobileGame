import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PLAYERS = [
  { id: "1", name: "Amit (Host)", ready: true },
  { id: "2", name: "Suresh", ready: false },
  { id: "3", name: "Waiting...", ready: false, empty: true },
];

export default function WaitingRoom() {
  return (
    <View style={styles.container}>
      <View style={styles.roomInfo}>
        <Text style={styles.codeLabel}>ROOM CODE</Text>
        <Text style={styles.codeText}>X J 7 9</Text>
      </View>

      <FlatList
        data={PLAYERS}
        renderItem={({ item }) => (
          <View style={[styles.playerCard, item.empty && { opacity: 0.3 }]}>
            <View style={styles.avatarPlaceholder} />
            <Text style={styles.playerName}>{item.name}</Text>
            {item.ready && (
              <Ionicons name="checkmark-circle" size={24} color="#00A651" />
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.startBtn}>
        <Text style={styles.startBtnText}>START GAME (2/4)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", padding: 25 },
  roomInfo: { marginTop: 60, alignItems: "center", marginBottom: 40 },
  codeLabel: { color: "#FFF", opacity: 0.5, fontWeight: "900" },
  codeText: {
    color: "#FFDE00",
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 5,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333",
    marginRight: 15,
  },
  playerName: { color: "#FFF", flex: 1, fontWeight: "800" },
  startBtn: {
    height: 70,
    backgroundColor: "#00A651",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
  },
  startBtnText: { color: "#FFF", fontSize: 20, fontWeight: "900" },
});
