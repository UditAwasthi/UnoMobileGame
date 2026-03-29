import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  Easing,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type CardColor = "red" | "blue" | "green" | "yellow";
type CardValue =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "skip"
  | "reverse"
  | "draw-two"
  | "wild"
  | "wild-draw-four";

interface UnoCard {
  id: string;
  color: CardColor | null; // null = wild
  value: CardValue;
}

type Turn = "player" | "ai";
type Direction = 1 | -1;

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const { width: SW, height: SH } = Dimensions.get("window");

const UNO_COLORS: Record<CardColor, string> = {
  red: "#ED1C24",
  blue: "#005697",
  green: "#00A651",
  yellow: "#FFDE00",
};

const CARD_SYMBOLS: Partial<Record<CardValue, string>> = {
  skip: "⊘",
  reverse: "⟲",
  "draw-two": "+2",
  wild: "WILD",
  "wild-draw-four": "+4",
};

const DECK_COLORS: CardColor[] = ["red", "blue", "green", "yellow"];
const NUMBERS: CardValue[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const SPECIALS: CardValue[] = ["skip", "reverse", "draw-two"];
const OPP_NAMES = ["PANDA", "FOXY", "FROG"];
const OPP_EMOJIS = ["🐼", "🦊", "🐸"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

let _uid = 0;
const mkCard = (color: CardColor | null, value: CardValue): UnoCard => ({
  id: String(++_uid),
  color,
  value,
});

const randomFrom = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomAngle = (): number =>
  parseFloat((Math.random() * 14 - 7).toFixed(1));

const isPlayable = (
  card: UnoCard,
  discColor: CardColor | null,
  discValue: CardValue,
): boolean => {
  if (card.color === null) return true;
  return card.color === discColor || card.value === discValue;
};

const getDisplayValue = (value: CardValue): string =>
  CARD_SYMBOLS[value] ?? value;

// ─── CARD FACE ───────────────────────────────────────────────────────────────

interface CardFaceProps {
  card: UnoCard;
  width: number;
  height: number;
  playable?: boolean;
  style?: object;
}

const CardFace: React.FC<CardFaceProps> = ({
  card,
  width,
  height,
  playable,
  style,
}) => {
  const isWild = card.color === null;
  const disp = getDisplayValue(card.value);
  const bg = card.color ? UNO_COLORS[card.color] : "#111";

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: 10,
          borderWidth: 3,
          borderColor: "#fff",
          overflow: "hidden",
          backgroundColor: bg,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: playable ? "#FFDE00" : "#000",
          shadowOffset: { width: 0, height: playable ? 0 : 6 },
          shadowOpacity: playable ? 0.95 : 0.5,
          shadowRadius: playable ? 12 : 12,
          elevation: playable ? 14 : 8,
        },
        style,
      ]}
    >
      {/* Horizontal texture stripes */}
      {Array.from({ length: Math.ceil(height / 10) }).map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: i * 10,
            height: 10,
            backgroundColor:
              i % 2 === 0 ? "rgba(255,255,255,0.025)" : "transparent",
          }}
        />
      ))}

      {/* Diagonal shimmer */}
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`d${i}`}
          style={{
            position: "absolute",
            left: i * (width / 4) - 20,
            top: -height,
            width: 1,
            height: height * 3,
            backgroundColor: "rgba(255,255,255,0.04)",
            transform: [{ rotate: "45deg" }],
          }}
        />
      ))}

      {/* Shine gradient */}
      <LinearGradient
        colors={["rgba(255,255,255,0.18)", "transparent", "rgba(0,0,0,0.14)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {isWild ? (
        <>
          {/* 4-color quadrants */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width,
              height,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <View
              style={{
                width: width / 2,
                height: height / 2,
                backgroundColor: "#ED1C24",
              }}
            />
            <View
              style={{
                width: width / 2,
                height: height / 2,
                backgroundColor: "#005697",
              }}
            />
            <View
              style={{
                width: width / 2,
                height: height / 2,
                backgroundColor: "#FFDE00",
              }}
            />
            <View
              style={{
                width: width / 2,
                height: height / 2,
                backgroundColor: "#00A651",
              }}
            />
          </View>
          {/* Oval ring */}
          <View
            style={{
              width: width * 0.56,
              height: height * 0.72,
              borderRadius: 999,
              borderWidth: 2.5,
              borderColor: "rgba(255,255,255,0.5)",
              position: "absolute",
            }}
          />
          {/* Center white circle */}
          <View
            style={{
              width: width * 0.5,
              height: width * 0.5,
              borderRadius: 999,
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontSize: width * 0.14,
                fontWeight: "900",
                color: "#111",
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              {card.value === "wild-draw-four" ? "+4" : "WILD"}
            </Text>
          </View>
        </>
      ) : (
        <>
          {/* Top-left corner value */}
          <Text
            style={{
              position: "absolute",
              top: 5,
              left: 7,
              fontSize: width * 0.22,
              fontWeight: "900",
              color: "#fff",
              textShadowColor: "rgba(0,0,0,0.5)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
              zIndex: 5,
              lineHeight: width * 0.24,
            }}
          >
            {disp}
          </Text>

          {/* Center oval + value */}
          <View
            style={{
              width: width * 0.68,
              height: height * 0.72,
              borderRadius: 999,
              borderWidth: 2.5,
              borderColor: "rgba(255,255,255,0.7)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 5,
            }}
          >
            <Text
              style={{
                fontSize: width * 0.52,
                fontWeight: "900",
                color: "#fff",
                textShadowColor: "rgba(0,0,0,0.35)",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
                lineHeight: width * 0.58,
              }}
            >
              {disp}
            </Text>
          </View>

          {/* Bottom-right corner value (rotated) */}
          <Text
            style={{
              position: "absolute",
              bottom: 5,
              right: 7,
              fontSize: width * 0.22,
              fontWeight: "900",
              color: "#fff",
              textShadowColor: "rgba(0,0,0,0.5)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
              zIndex: 5,
              lineHeight: width * 0.24,
              transform: [{ rotate: "180deg" }],
            }}
          >
            {disp}
          </Text>
        </>
      )}

      {/* Playable highlight border */}
      {playable && (
        <View
          style={{
            position: "absolute",
            top: -3,
            left: -3,
            right: -3,
            bottom: -3,
            borderRadius: 13,
            borderWidth: 2.5,
            borderColor: "rgba(255,222,0,0.9)",
          }}
        />
      )}
    </View>
  );
};

// ─── CARD BACK ───────────────────────────────────────────────────────────────

const CardBack: React.FC<{ width: number; height: number; style?: object }> = ({
  width,
  height,
  style,
}) => (
  <View
    style={[
      {
        width,
        height,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: "#fff",
        overflow: "hidden",
        backgroundColor: "#1a0a2e",
        justifyContent: "center",
        alignItems: "center",
      },
      style,
    ]}
  >
    <LinearGradient
      colors={["#1a0a2e", "#2d1654", "#1a0a2e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <View
      style={{
        position: "absolute",
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.35)",
      }}
    />
    {Array.from({ length: 10 }).map((_, i) => (
      <View
        key={i}
        style={{
          position: "absolute",
          left: i * 12 - 20,
          top: -height,
          width: 1,
          height: height * 3,
          backgroundColor: "rgba(255,255,255,0.035)",
          transform: [{ rotate: "45deg" }],
        }}
      />
    ))}
    <Text
      style={{
        fontSize: 26,
        fontWeight: "900",
        fontStyle: "italic",
        color: "#ED1C24",
        textShadowColor: "#fff",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
        letterSpacing: 2,
        zIndex: 5,
      }}
    >
      UNO
    </Text>
  </View>
);

// ─── OPPONENT SLOT ────────────────────────────────────────────────────────────

const OpponentSlot: React.FC<{
  idx: number;
  count: number;
  isActive: boolean;
}> = ({ idx, count, isActive }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      const pLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 650,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      );
      const gLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      pLoop.start();
      gLoop.start();
      return () => {
        pLoop.stop();
        gLoop.stop();
        pulseAnim.setValue(1);
        glowAnim.setValue(0);
      };
    }
  }, [isActive]);

  const dotOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View
      style={[styles.oppSlot, { transform: [{ scale: pulseAnim }] }]}
    >
      {isActive && (
        <Animated.View style={[styles.turnDot, { opacity: dotOpacity }]} />
      )}

      <View style={[styles.oppRing, isActive && styles.oppRingActive]}>
        <Text style={styles.oppEmoji}>{OPP_EMOJIS[idx]}</Text>
      </View>

      <View
        style={[styles.cardCountBadge, count === 1 && styles.cardCountBadgeUno]}
      >
        <Text style={[styles.badgeText, count === 1 && styles.badgeTextUno]}>
          {count}
        </Text>
      </View>

      <Text style={styles.oppName}>{OPP_NAMES[idx]}</Text>

      <View style={styles.miniCardRow}>
        {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
          <View key={i} style={styles.miniCard}>
            <View style={styles.miniCardInner} />
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

// ─── COLOR PICKER MODAL ───────────────────────────────────────────────────────

const ColorPickerModal: React.FC<{
  visible: boolean;
  onSelect: (color: CardColor) => void;
}> = ({ visible, onSelect }) => {
  const [selected, setSelected] = useState<CardColor | null>(null);
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSelected(null);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 90,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const swatches: { color: CardColor; label: string }[] = [
    { color: "red", label: "RED" },
    { color: "blue", label: "BLUE" },
    { color: "green", label: "GREEN" },
    { color: "yellow", label: "YELLOW" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.cpOverlay}>
          <Animated.View
            style={[
              styles.cpCard,
              { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
            ]}
          >
            <Text style={styles.cpTitle}>Choose a Color</Text>
            <Text style={styles.cpSub}>WILD CARD PLAYED</Text>

            <View style={styles.cpSwatches}>
              {swatches.map(({ color, label }) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelected(color)}
                  activeOpacity={0.8}
                  style={styles.cpSwatchWrap}
                >
                  <View
                    style={[
                      styles.cpSwatch,
                      { backgroundColor: UNO_COLORS[color] },
                      selected === color && styles.cpSwatchSelected,
                    ]}
                  />
                  <Text style={styles.cpSwatchLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => selected && onSelect(selected)}
              activeOpacity={selected ? 0.85 : 1}
              style={[styles.cpConfirm, !selected && { opacity: 0.4 }]}
              disabled={!selected}
            >
              <LinearGradient
                colors={selected ? ["#FFDE00", "#e6c400"] : ["#555", "#444"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cpConfirmGradient}
              >
                <Text
                  style={[styles.cpConfirmText, !selected && { color: "#888" }]}
                >
                  SELECT COLOR
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
};

// ─── TOAST ────────────────────────────────────────────────────────────────────

const Toast: React.FC<{ message: string; visible: boolean }> = ({
  message,
  visible,
}) => {
  const translateY = useRef(new Animated.Value(-30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[styles.toast, { transform: [{ translateY }], opacity }]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function GameTable() {
  const insets = useSafeAreaInsets();

  const [playerHand, setPlayerHand] = useState<UnoCard[]>([]);
  const [oppCounts, setOppCounts] = useState([7, 2, 5]);
  const [discardColor, setDiscardColor] = useState<CardColor | null>("red");
  const [discardValue, setDiscardValue] = useState<CardValue>("7");
  const [deckCount, setDeckCount] = useState(34);
  const [currentTurn, setCurrentTurn] = useState<Turn>("player");
  const [direction, setDirection] = useState<Direction>(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pendingWild, setPendingWild] = useState<UnoCard | null>(null);
  const [discardHistory, setDiscardHistory] = useState<
    { color: CardColor | null; angle: number }[]
  >([
    { color: "green", angle: -9 },
    { color: "blue", angle: -16 },
  ]);

  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dirFlip = useRef(new Animated.Value(1)).current;
  const topCardAngle = useRef(new Animated.Value(5)).current;

  // Init hand
  useEffect(() => {
    setPlayerHand([
      mkCard("red", "5"),
      mkCard("blue", "7"),
      mkCard("green", "skip"),
      mkCard("yellow", "2"),
      mkCard("yellow", "9"),
      mkCard("red", "draw-two"),
      mkCard(null, "wild"),
      mkCard(null, "wild-draw-four"),
    ]);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (aiTimer.current) clearTimeout(aiTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((msg: string, ms = 2200) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), ms);
  }, []);

  const getNextOpp = useCallback((dir: Direction) => (dir === 1 ? 0 : 2), []);

  const animateTopCard = useCallback(() => {
    Animated.spring(topCardAngle, {
      toValue: randomAngle(),
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const startAITurn = useCallback(
    (dir: Direction) => {
      setCurrentTurn("ai");
      if (aiTimer.current) clearTimeout(aiTimer.current);
      aiTimer.current = setTimeout(
        () => {
          const oppIdx = getNextOpp(dir);
          setOppCounts((prev) => {
            const next = [...prev];
            if (next[oppIdx] > 1) {
              next[oppIdx]--;
            } else {
              showToast(`${OPP_NAMES[oppIdx]} calls UNO!`);
            }
            return next;
          });
          const c = randomFrom(DECK_COLORS);
          const v: CardValue =
            Math.random() < 0.15 ? randomFrom(SPECIALS) : randomFrom(NUMBERS);
          setDiscardColor(c);
          setDiscardValue(v);
          setDiscardHistory((prev) => [
            { color: c, angle: randomAngle() },
            prev[0],
          ]);
          animateTopCard();
          setCurrentTurn("player");
        },
        1300 + Math.random() * 900,
      );
    },
    [getNextOpp, showToast, animateTopCard],
  );

  const playCard = useCallback(
    (card: UnoCard, idx: number) => {
      if (currentTurn !== "player") return;
      if (!isPlayable(card, discardColor, discardValue)) {
        showToast("❌ Can't play that card!");
        return;
      }

      const newHand = [...playerHand];
      newHand.splice(idx, 1);
      setPlayerHand(newHand);
      setDeckCount((d) => Math.max(d - 1, 1));
      setDiscardHistory((prev) => [
        { color: discardColor, angle: randomAngle() },
        prev[0],
      ]);

      let nextDir = direction;

      if (card.value === "draw-two") {
        const opp = getNextOpp(direction);
        setOppCounts((prev) => {
          const next = [...prev];
          next[opp] = Math.min(next[opp] + 2, 14);
          return next;
        });
        showToast("🃏 Opponent draws 2!");
      }
      if (card.value === "skip") showToast("⊘ Opponent skipped!");
      if (card.value === "reverse") {
        nextDir = (direction === 1 ? -1 : 1) as Direction;
        setDirection(nextDir);
        Animated.spring(dirFlip, {
          toValue: nextDir,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }).start();
        showToast("⟲ Direction reversed!");
      }

      if (card.color === null) {
        setDiscardValue(card.value);
        setPendingWild(card);
        setShowColorPicker(true);
        return;
      }

      setDiscardColor(card.color);
      setDiscardValue(card.value);
      animateTopCard();

      if (newHand.length === 0) {
        showToast("🎉 YOU WIN! Incredible!", 4000);
        return;
      }
      if (newHand.length === 1) showToast("⚠️ UNO — one card left!", 2000);

      startAITurn(nextDir);
    },
    [
      currentTurn,
      playerHand,
      discardColor,
      discardValue,
      direction,
      getNextOpp,
      showToast,
      animateTopCard,
      startAITurn,
    ],
  );

  const drawCard = useCallback(() => {
    if (currentTurn !== "player") return;
    const color = randomFrom(DECK_COLORS);
    const value: CardValue =
      Math.random() < 0.18 ? randomFrom(SPECIALS) : randomFrom(NUMBERS);
    setPlayerHand((prev) => [...prev, mkCard(color, value)]);
    setDeckCount((d) => Math.max(d - 1, 1));
    showToast("🃏 Drew a card");
    startAITurn(direction);
  }, [currentTurn, direction, showToast, startAITurn]);

  const onColorSelected = useCallback(
    (color: CardColor) => {
      setDiscardColor(color);
      setShowColorPicker(false);
      showToast(`🎨 Color → ${color.toUpperCase()}!`);

      if (pendingWild?.value === "wild-draw-four") {
        const opp = getNextOpp(direction);
        setOppCounts((prev) => {
          const next = [...prev];
          next[opp] = Math.min(next[opp] + 4, 14);
          return next;
        });
        setTimeout(() => showToast("⚡ Opponent draws 4!", 2500), 400);
      }
      setPendingWild(null);
      animateTopCard();
      startAITurn(direction);
    },
    [
      pendingWild,
      direction,
      getNextOpp,
      showToast,
      animateTopCard,
      startAITurn,
    ],
  );

  const callUno = useCallback(() => {
    if (playerHand.length === 1) showToast("🟡 UNO! Nice call!", 1800);
    else showToast("😂 UNO is for 1 card!", 1800);
  }, [playerHand.length, showToast]);

  const activeOpp = currentTurn === "ai" ? getNextOpp(direction) : -1;

  const topCardDeg = topCardAngle.interpolate({
    inputRange: [-10, 10],
    outputRange: ["-10deg", "10deg"],
  });

  // ─── RENDER ──────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Felt table */}
      <LinearGradient
        colors={["#1a5c28", "#0d3a18", "#071e0c"]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Felt texture lines */}
      {Array.from({ length: 38 }).map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: i * (SH / 38),
            height: 1,
            backgroundColor: "rgba(0,0,0,0.055)",
          }}
        />
      ))}

      {/* Inner rim */}
      <View style={styles.tableRim} pointerEvents="none" />

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.tbBtn}
          onPress={() => showToast("👋 Leaving...")}
          activeOpacity={0.75}
        >
          <Text style={styles.tbBtnIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.dirPill}>
          <Animated.Text
            style={[styles.dirArrow, { transform: [{ scaleX: dirFlip }] }]}
          >
            ↻
          </Animated.Text>
          <Text style={styles.dirText}>
            {direction === 1 ? "CLOCKWISE" : "REVERSED"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.tbBtn}
          onPress={() => showToast("💬 Chat coming soon!")}
          activeOpacity={0.75}
        >
          <Text style={styles.tbBtnIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* ── SCORE STRIP ── */}
      <View style={styles.scoreStrip}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Round</Text>
          <Text style={styles.scoreVal}>3</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreVal}>140</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Deck</Text>
          <Text style={styles.scoreVal}>{deckCount}</Text>
        </View>
      </View>

      {/* ── OPPONENTS ── */}
      <View style={styles.opponents}>
        {[0, 1, 2].map((i) => (
          <OpponentSlot
            key={i}
            idx={i}
            count={oppCounts[i]}
            isActive={activeOpp === i}
          />
        ))}
      </View>

      {/* ── CENTER AREA ── */}
      <View style={styles.center}>
        {/* Draw Pile */}
        <TouchableOpacity onPress={drawCard} activeOpacity={0.85}>
          <View style={styles.drawPileWrap}>
            <CardBack
              width={88}
              height={126}
              style={{
                position: "absolute",
                top: -6,
                left: -6,
                opacity: 0.32,
                zIndex: 0,
              }}
            />
            <CardBack
              width={88}
              height={126}
              style={{
                position: "absolute",
                top: -3,
                left: -3,
                opacity: 0.52,
                zIndex: 1,
              }}
            />
            <CardBack width={88} height={126} style={{ zIndex: 2 }} />
            <View style={styles.drawCountBadge}>
              <Text style={styles.drawCountText}>{deckCount}</Text>
            </View>
            <Text style={styles.drawPileLabel}>DRAW PILE</Text>
          </View>
        </TouchableOpacity>

        {/* Discard Pile */}
        <View style={styles.discardWrap}>
          {discardHistory.map((dh, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                top: (i + 1) * 5,
                left: -((i + 1) * 13),
                opacity: 1 - (i + 1) * 0.38,
                transform: [{ rotate: `${dh.angle}deg` }],
                zIndex: -i - 1,
              }}
            >
              <View
                style={{
                  width: 102,
                  height: 144,
                  borderRadius: 11,
                  borderWidth: 4,
                  borderColor: "#fff",
                  backgroundColor: dh.color ? UNO_COLORS[dh.color] : "#111",
                }}
              />
            </View>
          ))}

          <Animated.View
            style={{
              transform: [{ rotate: topCardDeg }],
              zIndex: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 14 },
              shadowOpacity: 0.65,
              shadowRadius: 20,
              elevation: 16,
            }}
          >
            <CardFace
              card={{ id: "top", color: discardColor, value: discardValue }}
              width={102}
              height={144}
            />
          </Animated.View>
        </View>
      </View>

      {/* ── PLAYER SECTION ── */}
      <View
        style={[styles.playerSection, { paddingBottom: insets.bottom + 10 }]}
      >
        <View style={styles.playerMeta}>
          <View style={styles.playerInfo}>
            <View style={styles.playerAvatar}>
              <Text style={styles.playerAvatarEmoji}>😎</Text>
            </View>
            <View>
              <Text style={styles.playerName}>YOU</Text>
              <View
                style={[
                  styles.turnBadge,
                  currentTurn !== "player" && styles.turnBadgeWaiting,
                ]}
              >
                <Text
                  style={[
                    styles.turnBadgeText,
                    currentTurn !== "player" && styles.turnBadgeTextWaiting,
                  ]}
                >
                  {currentTurn === "player" ? "YOUR TURN" : "WAITING..."}
                </Text>
              </View>
            </View>
          </View>

          <TouchableHighlight
            onPress={callUno}
            underlayColor="rgba(237,28,36,0.65)"
            style={styles.unoBtn}
          >
            <Text style={styles.unoBtnText}>UNO!</Text>
          </TouchableHighlight>
        </View>

        {/* Hand */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.handScroll, { minWidth: SW }]}
        >
          {playerHand.map((card, i) => {
            const n = playerHand.length;
            const angle = (i - (n - 1) / 2) * 5;
            const lift = Math.abs(i - (n - 1) / 2) * 2;
            const playable =
              currentTurn === "player" &&
              isPlayable(card, discardColor, discardValue);

            return (
              <TouchableOpacity
                key={card.id}
                onPress={() => playCard(card, i)}
                activeOpacity={0.82}
                style={[
                  styles.handCardWrap,
                  {
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: lift },
                    ],
                    zIndex: i,
                    marginRight: n > 5 ? -20 : 5,
                  },
                ]}
              >
                <CardFace
                  card={card}
                  width={78}
                  height={112}
                  playable={playable}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── TOAST ── */}
      <Toast message={toastMsg} visible={toastVisible} />

      {/* ── COLOR PICKER ── */}
      <ColorPickerModal visible={showColorPicker} onSelect={onColorSelected} />
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },

  tableRim: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.05)",
  },

  // TOP BAR
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    zIndex: 10,
  },
  tbBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  tbBtnIcon: { fontSize: 18, color: "rgba(255,255,255,0.85)" },
  dirPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dirArrow: { fontSize: 18, color: "#FFDE00" },
  dirText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#FFDE00",
  },

  // SCORE
  scoreStrip: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 34,
    marginBottom: 4,
    zIndex: 10,
  },
  scoreItem: { alignItems: "center" },
  scoreLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  scoreVal: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 26,
  },

  // OPPONENTS
  opponents: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    marginTop: 6,
    zIndex: 10,
  },
  oppSlot: {
    alignItems: "center",
    gap: 5,
    position: "relative",
  },
  turnDot: {
    position: "absolute",
    top: -10,
    alignSelf: "center",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFDE00",
    shadowColor: "#FFDE00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  oppRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "#0a2010",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  oppRingActive: {
    borderColor: "#FFDE00",
    shadowColor: "#FFDE00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  },
  oppEmoji: { fontSize: 28 },
  cardCountBadge: {
    position: "absolute",
    top: 34,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0d3a18",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  cardCountBadgeUno: { backgroundColor: "#ED1C24" },
  badgeText: { fontSize: 10, fontWeight: "900", color: "#111" },
  badgeTextUno: { color: "#fff" },
  oppName: {
    fontSize: 10,
    fontWeight: "900",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 0.5,
  },
  miniCardRow: { flexDirection: "row" },
  miniCard: {
    width: 11,
    height: 17,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    marginRight: 2,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  miniCardInner: {
    width: 5,
    height: 9,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  // CENTER
  center: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    zIndex: 5,
  },
  drawPileWrap: {
    position: "relative",
    width: 88,
    height: 126,
  },
  drawCountBadge: {
    position: "absolute",
    top: -9,
    right: -9,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFDE00",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  drawCountText: { fontSize: 10, fontWeight: "900", color: "#111" },
  drawPileLabel: {
    position: "absolute",
    bottom: -22,
    alignSelf: "center",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 2,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
  },
  discardWrap: {
    position: "relative",
    width: 102,
    height: 144,
  },

  // PLAYER SECTION
  playerSection: { zIndex: 10 },
  playerMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  playerInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  playerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#003d6e",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  playerAvatarEmoji: { fontSize: 24 },
  playerName: {
    fontSize: 11,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.5,
  },
  turnBadge: {
    marginTop: 3,
    backgroundColor: "rgba(255,222,0,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,222,0,0.35)",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  turnBadgeWaiting: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  turnBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#FFDE00",
    textTransform: "uppercase",
  },
  turnBadgeTextWaiting: { color: "rgba(255,255,255,0.35)" },
  unoBtn: {
    backgroundColor: "#ED1C24",
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 22,
    paddingVertical: 10,
    shadowColor: "#ED1C24",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
  },
  unoBtnText: {
    fontSize: 22,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#fff",
    letterSpacing: 3,
  },
  handScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: "flex-end",
  },
  handCardWrap: { position: "relative" },

  // COLOR PICKER
  cpOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  cpCard: {
    backgroundColor: "#181818",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.88,
    shadowRadius: 44,
    elevation: 32,
    minWidth: 300,
  },
  cpTitle: {
    fontSize: 26,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#fff",
    letterSpacing: 2,
    marginBottom: 4,
  },
  cpSub: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    marginBottom: 28,
  },
  cpSwatches: { flexDirection: "row", gap: 16, marginBottom: 32 },
  cpSwatchWrap: { alignItems: "center", gap: 8 },
  cpSwatch: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: "transparent",
  },
  cpSwatchSelected: {
    borderColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
  cpSwatchLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
  },
  cpConfirm: { width: "100%", borderRadius: 14, overflow: "hidden" },
  cpConfirmGradient: { paddingVertical: 15, alignItems: "center" },
  cpConfirmText: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 3,
    color: "#111",
    textTransform: "uppercase",
  },

  // TOAST
  toast: {
    position: "absolute",
    top: 110,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 10,
    zIndex: 80,
  },
  toastText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#fff",
  },
});
