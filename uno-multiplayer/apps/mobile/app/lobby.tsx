import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  ZoomIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const UNO_COLORS = {
  red: "#ED1C24",
  blue: "#005697",
  green: "#00A651",
  yellow: "#FFDE00",
};

export default function LobbyScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // Animation Values
  const pulse = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.1), withTiming(1)),
      -1,
      true,
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 10000 }),
      -1,
      false,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.1], [0.8, 1]),
  }));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#050505" : "#F5F5F5" },
      ]}
    >
      {/* Animated Background Aura */}
      <Animated.View
        style={[
          styles.aura,
          { transform: [{ rotate: `${rotation.value}deg` }] },
        ]}
      >
        <LinearGradient
          colors={[
            UNO_COLORS.red + "44",
            UNO_COLORS.blue + "44",
            UNO_COLORS.yellow + "44",
            UNO_COLORS.green + "44",
          ]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.lobbyTitle, { color: theme.text }]}>
            QUICK MATCH
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Matchmaking Status */}
        <View style={styles.statusContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              pulseStyle,
              { borderColor: UNO_COLORS.red },
            ]}
          />
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
              }}
              style={styles.mainAvatar}
            />
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>FINDING PLAYERS...</Text>
            </View>
          </View>
        </View>

        {/* Player Slots */}
        <View style={styles.slotsGrid}>
          {[1, 2, 3].map((i) => (
            <Animated.View
              key={i}
              entering={ZoomIn.delay(i * 300)}
              style={[
                styles.slot,
                {
                  backgroundColor: isDark ? "#111" : "#EEE",
                  borderStyle: "dashed",
                },
              ]}
            >
              <Ionicons name="person-add" size={30} color={theme.icon + "44"} />
              <Text style={[styles.slotLabel, { color: theme.icon + "66" }]}>
                WAITING...
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Dynamic Tip Ticker */}
        <Animated.View entering={FadeIn.delay(1000)} style={styles.tipBox}>
          <Ionicons name="bulb" size={20} color={UNO_COLORS.yellow} />
          <Text style={styles.tipText}>
            PRO TIP:{" "}
            <Text style={{ fontWeight: "400" }}>
              Save your "Wild Draw 4" for when a player has only 2 cards left!
            </Text>
          </Text>
        </Animated.View>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelBtnText}>LEAVE LOBBY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  aura: {
    position: "absolute",
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    width: "100%",
    padding: 25,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lobbyTitle: { fontSize: 24, fontWeight: "900", letterSpacing: 2 },

  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  pulseCircle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
  },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#000",
    borderWidth: 4,
    borderColor: "#FFF",
    elevation: 15,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  mainAvatar: { width: "100%", height: "100%" },
  statusBadge: {
    position: "absolute",
    bottom: -10,
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UNO_COLORS.red,
  },
  statusText: { color: "#FFF", fontSize: 10, fontWeight: "900" },

  slotsGrid: { flexDirection: "row", gap: 15, marginBottom: 30 },
  slot: {
    width: 90,
    height: 120,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  slotLabel: { fontSize: 10, fontWeight: "800" },

  tipBox: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    gap: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
  },
  tipText: { color: "#FFF", fontSize: 13, fontWeight: "800", flex: 1 },

  cancelBtn: {
    width: "100%",
    height: 60,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#000",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  cancelBtnText: { color: "#000", fontSize: 16, fontWeight: "900" },
});

// Helper for animations
function interpolate(value: number, input: number[], output: number[]) {
  "worklet";
  const [inMin, inMax] = input;
  const [outMin, outMax] = output;
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}
