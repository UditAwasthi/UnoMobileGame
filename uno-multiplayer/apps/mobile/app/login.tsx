import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Gyroscope } from "expo-sensors";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const UNO_COLORS = {
  red: "#ED1C24",
  blue: "#005697",
  green: "#00A651",
  yellow: "#FFDE00",
  black: "#000000",
  white: "#FFFFFF",
};

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // Parallax & Interaction Shared Values
  const gyroX = useSharedValue(0);
  const gyroY = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    // 60Hz update rate for smooth parallax
    Gyroscope.setUpdateInterval(16);
    const subscription = Gyroscope.addListener(({ x, y }) => {
      gyroX.value = withSpring(x, { damping: 20 });
      gyroY.value = withSpring(y, { damping: 20 });
    });
    return () => subscription.remove();
  }, []);

  // BACKGROUND PARALLAX (Deep movement)
  const bgStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          gyroY.value,
          [-1, 1],
          [-40, 40],
          Extrapolate.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          gyroX.value,
          [-1, 1],
          [-40, 40],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  // CONTENT PARALLAX (Counter movement for 3D depth)
  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          gyroY.value,
          [-1, 1],
          [15, -15],
          Extrapolate.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          gyroX.value,
          [-1, 1],
          [15, -15],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const animatedBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0A0A0A" : "#F0F0F0" },
      ]}
    >
      {/* PARALLAX BACKGROUND ACCENTS */}
      <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}>
        <View
          style={[
            styles.bgCircle,
            { backgroundColor: UNO_COLORS.blue, top: -50, right: -50 },
          ]}
        />
        <View
          style={[
            styles.bgCircle,
            {
              backgroundColor: UNO_COLORS.green,
              bottom: -80,
              left: -60,
              width: 280,
              height: 280,
            },
          ]}
        />
        <View
          style={[
            styles.bgCircle,
            {
              backgroundColor: UNO_COLORS.yellow,
              top: height * 0.3,
              left: -100,
              width: 150,
              height: 150,
              opacity: 0.1,
            },
          ]}
        />
      </Animated.View>

      <Animated.View style={[styles.inner, contentStyle]}>
        {/* Header: Giant Tilted Title */}
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeBtn}
          >
            <Ionicons
              name="close-circle"
              size={40}
              color={isDark ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleShadow}>LOGIN</Text>
            <Text style={styles.titleMain}>LOGIN</Text>
          </View>
        </Animated.View>

        {/* Form Section */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.form}
        >
          <View style={styles.inputContainer}>
            <View
              style={[styles.inputIcon, { backgroundColor: UNO_COLORS.blue }]}
            >
              <Ionicons name="mail" size={20} color="#FFF" />
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: isDark ? "#1A1A1A" : "#FFF",
                },
              ]}
              placeholder="PLAYER EMAIL"
              placeholderTextColor={isDark ? "#666" : "#AAA"}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <View
              style={[styles.inputIcon, { backgroundColor: UNO_COLORS.yellow }]}
            >
              <Ionicons name="lock-closed" size={20} color="#000" />
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: isDark ? "#1A1A1A" : "#FFF",
                },
              ]}
              placeholder="PASSCODE"
              placeholderTextColor={isDark ? "#666" : "#AAA"}
              secureTextEntry
            />
          </View>

          {/* 3D Action Button -> Routes to Lobby */}
          <Animated.View style={animatedBtnStyle}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => (btnScale.value = withTiming(0.9))}
              onPressOut={() => (btnScale.value = withSpring(1))}
              style={styles.loginBtn}
              onPress={() => router.push("/home")} // Navigates to the Matchmaking Lobby
            >
              <View style={styles.btnShadow} />
              <View style={styles.btnFace}>
                <Text style={styles.loginBtnText}>JOIN TABLE</Text>
                <Ionicons name="enter" size={24} color="#FFF" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={[styles.orText, { color: theme.icon }]}>
              OR CONNECT
            </Text>
            <View style={styles.line} />
          </View>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
            <View style={styles.googleIconBox}>
              <FontAwesome name="google" size={24} color={UNO_COLORS.red} />
            </View>
            <Text style={styles.googleText}>GOOGLE SIGN-IN</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={[styles.footerText, { color: theme.text }]}>
              NO ACCOUNT? <Text style={styles.signUpLink}>REGISTER</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  bgCircle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.25,
  },
  inner: { flex: 1, padding: 25, justifyContent: "center" },
  header: { marginBottom: 40, alignItems: "center" },
  closeBtn: { position: "absolute", top: -20, left: 0, zIndex: 10 },
  titleWrapper: { transform: [{ rotate: "-5deg" }] },
  titleMain: {
    fontSize: 60,
    fontWeight: "900",
    color: UNO_COLORS.red,
    letterSpacing: -2,
    textShadowColor: "#FFF",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  titleShadow: {
    position: "absolute",
    fontSize: 60,
    fontWeight: "900",
    color: "#000",
    top: 4,
    left: 4,
    letterSpacing: -2,
  },
  form: { gap: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  inputIcon: {
    width: 50,
    height: 60,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderRightWidth: 3,
    borderColor: "#000",
  },
  input: {
    flex: 1,
    height: 60,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: "800",
    borderWidth: 3,
    borderLeftWidth: 0,
    borderColor: "#000",
  },
  loginBtn: { height: 70, marginTop: 10 },
  btnShadow: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "90%",
    backgroundColor: "#8B0000",
    borderRadius: 15,
  },
  btnFace: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "90%",
    backgroundColor: UNO_COLORS.red,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loginBtnText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
    fontStyle: "italic",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  line: { flex: 1, height: 3, backgroundColor: "#000" },
  orText: { fontWeight: "900", fontSize: 12 },
  googleBtn: {
    height: 65,
    backgroundColor: UNO_COLORS.white,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  googleIconBox: {
    width: 60,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 3,
    borderColor: "#000",
  },
  googleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
  },
  footer: { alignItems: "center", marginTop: 40 },
  footerText: { fontWeight: "900", fontSize: 14 },
  signUpLink: { color: UNO_COLORS.blue, textDecorationLine: "underline" },
});
