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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
  FadeInDown,
} from "react-native-reanimated";
import { Gyroscope } from "expo-sensors";

// 1. IMPORTANT: Use the component we built!
import BottomDock from "@/components/BottomDock";

const { width, height } = Dimensions.get("window");

const UNO_COLORS = {
  red: "#ED1C24",
  blue: "#005697",
  green: "#00A651",
  yellow: "#FFDE00",
  surface: "#121212",
};

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const gyroX = useSharedValue(0);
  const gyroY = useSharedValue(0);

  useEffect(() => {
    Gyroscope.setUpdateInterval(16);
    const sub = Gyroscope.addListener(({ x, y }) => {
      gyroX.value = x;
      gyroY.value = y;
    });
    return () => sub.remove();
  }, []);

  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(
          interpolate(gyroY.value, [-1, 1], [-15, 15], Extrapolate.CLAMP),
        ),
      },
      {
        translateY: withSpring(
          interpolate(gyroX.value, [-1, 1], [-15, 15], Extrapolate.CLAMP),
        ),
      },
    ],
  }));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#F0F0F0" },
      ]}
    >
      {/* BACKGROUND DECORATION */}
      <View
        style={[
          styles.bgBlob,
          {
            backgroundColor: UNO_COLORS.red,
            top: -100,
            right: -50,
            opacity: 0.15,
          },
        ]}
      />
      <View
        style={[
          styles.bgBlob,
          {
            backgroundColor: UNO_COLORS.blue,
            bottom: -50,
            left: -50,
            opacity: 0.1,
          },
        ]}
      />

      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
              }}
              style={styles.avatar}
            />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>12</Text>
            </View>
          </View>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Welcome back,
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              AMIT SINGH
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.statChip}>
          <MaterialCommunityIcons
            name="poker-chip"
            size={18}
            color={UNO_COLORS.yellow}
          />
          <Text style={[styles.statValue, { color: theme.text }]}>12,450</Text>
        </TouchableOpacity>
      </View>

      {/* HERO SECTION */}
      <View style={styles.heroSection}>
        <Animated.View style={[styles.deckContainer, parallaxStyle]}>
          <View
            style={[
              styles.deckCard,
              {
                backgroundColor: UNO_COLORS.blue,
                transform: [{ rotate: "-12deg" }, { translateX: -30 }],
              },
            ]}
          />
          <View
            style={[
              styles.deckCard,
              {
                backgroundColor: UNO_COLORS.green,
                transform: [{ rotate: "12deg" }, { translateX: 30 }],
              },
            ]}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.mainDeckCard, { backgroundColor: UNO_COLORS.red }]}
          >
            <View style={styles.cardLogoContainer}>
              <Text style={styles.cardLogoText}>UNO</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ACTION CENTER */}
      <View style={styles.actionCenter}>
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <TouchableOpacity
            style={styles.mainPlayBtn}
            onPress={() => router.push("/lobby")}
          >
            <View style={styles.playBtnInner}>
              <Text style={styles.playBtnLabel}>START MATCH</Text>
              <Ionicons name="play-forward" size={28} color="#000" />
            </View>
            <View style={styles.playBtnShadow} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.subBtn, { backgroundColor: UNO_COLORS.surface }]}
          >
            <Ionicons name="people" size={22} color="#FFF" />
            <Text style={styles.subBtnText}>FRIENDS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subBtn, { backgroundColor: UNO_COLORS.surface }]}
          >
            <Ionicons name="trophy" size={22} color="#FFF" />
            <Text style={styles.subBtnText}>LEADERBOARD</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. THE CLEAN FIX: Only use the component! */}
      <BottomDock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  bgBlob: { position: "absolute", width: 300, height: 300, borderRadius: 150 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 60,
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarWrapper: { width: 50, height: 50 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "#222",
  },
  levelBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: UNO_COLORS.green,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
  },
  levelText: { color: "#FFF", fontSize: 10, fontWeight: "900" },
  greeting: { fontSize: 12, fontWeight: "600", opacity: 0.6 },
  userName: { fontSize: 18, fontWeight: "900", letterSpacing: 0.5 },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statValue: { fontWeight: "800", fontSize: 14 },
  heroSection: { flex: 1, justifyContent: "center", alignItems: "center" },
  deckContainer: {
    width: 200,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  mainDeckCard: {
    width: 160,
    height: 240,
    borderRadius: 20,
    borderWidth: 6,
    borderColor: "#FFF",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardLogoContainer: {
    width: "85%",
    height: "90%",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardLogoText: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "900",
    fontStyle: "italic",
    transform: [{ skewX: "-12deg" }],
  },
  deckCard: {
    position: "absolute",
    width: 150,
    height: 230,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#FFF",
    opacity: 0.9,
  },
  actionCenter: { paddingHorizontal: 25, paddingBottom: 120, gap: 20 }, // Increased padding for dock clearance
  mainPlayBtn: { height: 85 },
  playBtnInner: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 75,
    backgroundColor: UNO_COLORS.yellow,
    borderRadius: 24,
    zIndex: 2,
    borderWidth: 3,
    borderColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  playBtnShadow: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 75,
    backgroundColor: "#B8860B",
    borderRadius: 24,
  },
  playBtnLabel: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
    fontStyle: "italic",
  },
  secondaryActions: { flexDirection: "row", gap: 15 },
  subBtn: {
    flex: 1,
    height: 65,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#333",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  subBtnText: { color: "#FFF", fontWeight: "800", fontSize: 13 },
});
