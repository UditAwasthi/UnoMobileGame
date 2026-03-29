import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Fonts } from "../../constants/theme";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const UNO_COLORS = {
  red: "#ED1C24",
  blue: "#005697",
  green: "#00A651",
  yellow: "#FFDE00",
  black: "#000000",
  white: "#FFFFFF",
  deepRed: "#8B0000",
};

export default function WelcomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // Animation Values
  const card1Val = useSharedValue(0);
  const card2Val = useSharedValue(0);
  const card3Val = useSharedValue(0);
  const glowAnim = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    card1Val.value = withDelay(300, withSpring(1));
    card2Val.value = withDelay(500, withSpring(1));
    card3Val.value = withDelay(700, withSpring(1));
    glowAnim.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, []);

  const getCardStyle = (
    value: Animated.SharedValue<number>,
    rotateDeg: number,
    translateX: number,
  ) => {
    return useAnimatedStyle(() => ({
      opacity: interpolate(value.value, [0, 0.5, 1], [0, 1, 1]),
      transform: [
        { translateY: interpolate(value.value, [0, 1], [300, 0]) },
        { rotate: `${interpolate(value.value, [0, 1], [0, rotateDeg])}deg` },
        { translateX: interpolate(value.value, [0, 1], [0, translateX]) },
      ],
    }));
  };

  const textGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowAnim.value, [0, 1], [0.7, 1]),
    transform: [{ scale: interpolate(glowAnim.value, [0, 1], [1, 1.02]) }],
  }));

  const btnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#080808" : "#F4F4F4" },
      ]}
    >
      <View
        style={[
          styles.glow,
          { backgroundColor: isDark ? "#ED1C2422" : "#ED1C2411" },
        ]}
      />

      {/* HERO SECTION */}
      <View style={styles.heroContainer}>
        <Animated.View
          style={[
            styles.card,
            styles.redCard,
            getCardStyle(card1Val, -25, -50),
          ]}
        >
          <Text style={styles.cardIcon}>5</Text>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.blueCard, getCardStyle(card2Val, 15, 60)]}
        >
          <Text style={styles.cardIcon}>2</Text>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.wildCard, getCardStyle(card3Val, -5, 5)]}
        >
          <View style={styles.wildInner}>
            <View
              style={[
                styles.wildQuadrant,
                { backgroundColor: UNO_COLORS.red, top: 0, left: 0 },
              ]}
            />
            <View
              style={[
                styles.wildQuadrant,
                { backgroundColor: UNO_COLORS.blue, top: 0, right: 0 },
              ]}
            />
            <View
              style={[
                styles.wildQuadrant,
                { backgroundColor: UNO_COLORS.yellow, bottom: 0, left: 0 },
              ]}
            />
            <View
              style={[
                styles.wildQuadrant,
                { backgroundColor: UNO_COLORS.green, bottom: 0, right: 0 },
              ]}
            />
            <Text style={styles.wildText}>WILD</Text>
          </View>
        </Animated.View>
      </View>

      {/* FOOTER SECTION */}
      <View style={styles.footer}>
        <Animated.View
          entering={FadeInDown.delay(900).duration(800)}
          style={styles.brandBlock}
        >
          <Animated.Text style={[styles.unoBrandText, textGlowStyle]}>
            UNO!
          </Animated.Text>
          <Text
            style={[
              styles.title,
              { color: theme.text, fontFamily: Fonts?.sans },
            ]}
          >
            The Mobile Experience
          </Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>
            Challenge friends, draw four, and shout the iconic word.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(1100).duration(800)}
          style={styles.buttonGroup}
        >
          {/* 3D PLAY BUTTON */}
          <Animated.View style={[styles.buttonWrapper, btnAnimatedStyle]}>
            <View style={styles.buttonShadow} />
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => (buttonScale.value = withTiming(0.96))}
              onPressOut={() => (buttonScale.value = withSpring(1))}
              // CHANGE THIS LINE:
              onPress={() => router.push("/login")}
              style={styles.mainButton}
            >
              <View style={styles.mainButtonContent}>
                <Text style={styles.btnText}>PLAY NOW</Text>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="play"
                    size={20}
                    color={UNO_COLORS.red}
                    style={{ marginLeft: 2 }}
                  />
                </View>
              </View>
              <View style={styles.shine} />
            </TouchableOpacity>
          </Animated.View>

          {/* SECONDARY BUTTON */}
          <TouchableOpacity
            onPress={() => router.push("/how-to-play")} // Or "/modal"
            style={[styles.secondaryButton, { borderColor: theme.icon + "44" }]}
          >
            <Text style={[styles.secondaryText, { color: theme.text }]}>
              How to Play
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: "space-between" },
  glow: {
    position: "absolute",
    top: "10%",
    width: width,
    height: width,
    borderRadius: width,
    filter: "blur(100px)",
  },
  heroContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    position: "relative",
  },
  card: {
    width: 130,
    height: 190,
    borderRadius: 16,
    position: "absolute",
    borderWidth: 4,
    borderColor: UNO_COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  redCard: { backgroundColor: UNO_COLORS.red },
  blueCard: { backgroundColor: UNO_COLORS.blue },
  wildCard: { backgroundColor: UNO_COLORS.black, padding: 8 },
  wildInner: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: UNO_COLORS.white,
  },
  wildQuadrant: { position: "absolute", width: "50%", height: "50%" },
  wildText: {
    color: UNO_COLORS.white,
    fontWeight: "900",
    fontSize: 24,
    fontStyle: "italic",
    zIndex: 2,
  },
  cardIcon: { color: UNO_COLORS.white, fontSize: 80, fontWeight: "900" },
  footer: { marginBottom: 50 },
  brandBlock: { alignItems: "center", marginBottom: 40 },
  unoBrandText: {
    fontSize: 72,
    fontWeight: "900",
    color: UNO_COLORS.red,
    fontStyle: "italic",
    letterSpacing: -4,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 15,
    lineHeight: 20,
  },
  buttonGroup: { gap: 20 },

  // 3D Button Styles
  buttonWrapper: { width: "100%", height: 68 },
  buttonShadow: {
    position: "absolute",
    bottom: -4,
    width: "100%",
    height: "100%",
    backgroundColor: UNO_COLORS.deepRed,
    borderRadius: 20,
  },
  mainButton: {
    flex: 1,
    backgroundColor: UNO_COLORS.red,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  mainButtonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  shine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },

  secondaryButton: {
    height: 60,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryText: { fontSize: 16, fontWeight: "700" },
});
