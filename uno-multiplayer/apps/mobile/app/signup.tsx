import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { Gyroscope } from "expo-sensors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const UNO_COLORS = {
  red: "#ED1C24",
  blue: "#005697",
  green: "#00A651",
  yellow: "#FFDE00",
  black: "#000000",
  white: "#FFFFFF",
};

export default function SignupScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  // Parallax Shared Values
  const gyroX = useSharedValue(0);
  const gyroY = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    // Set update interval to 60fps (16ms)
    Gyroscope.setUpdateInterval(16);

    const subscription = Gyroscope.addListener(({ x, y }) => {
      // We use a spring to smooth out the raw sensor jitter
      gyroX.value = withSpring(x, { damping: 20 });
      gyroY.value = withSpring(y, { damping: 20 });
    });

    return () => subscription.remove();
  }, []);

  // BACKGROUND PARALLAX (Moves more aggressively)
  const bgStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          gyroY.value,
          [-1, 1],
          [-30, 30],
          Extrapolate.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          gyroX.value,
          [-1, 1],
          [-30, 30],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  // CONTENT PARALLAX (Subtle shift)
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          gyroY.value,
          [-1, 1],
          [10, -10],
          Extrapolate.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          gyroX.value,
          [-1, 1],
          [10, -10],
          Extrapolate.CLAMP,
        ),
      },
      { scale: btnScale.value },
    ],
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0A0A0A" : "#F0F0F0" },
      ]}
    >
      {/* PARALLAX BACKGROUND LAYER */}
      <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}>
        <View
          style={[
            styles.bgCircle,
            { backgroundColor: UNO_COLORS.red, top: -40, left: -40 },
          ]}
        />
        <View
          style={[
            styles.bgCircle,
            {
              backgroundColor: UNO_COLORS.yellow,
              bottom: -60,
              right: -40,
              width: 250,
              height: 250,
            },
          ]}
        />
        <View
          style={[
            styles.bgCircle,
            {
              backgroundColor: UNO_COLORS.blue,
              top: height * 0.4,
              right: -100,
              width: 150,
              height: 150,
              opacity: 0.1,
            },
          ]}
        />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* PARALLAX FOREGROUND LAYER */}
        <Animated.View style={[styles.inner, cardStyle]}>
          <View style={styles.header}>
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
              <Text style={styles.titleShadow}>REGISTER</Text>
              <Text style={styles.titleMain}>REGISTER</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputIcon,
                  { backgroundColor: UNO_COLORS.green },
                ]}
              >
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: isDark ? "#1A1A1A" : "#FFF",
                  },
                ]}
                placeholder="PLAYER NAME"
                placeholderTextColor={isDark ? "#666" : "#AAA"}
              />
            </View>

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
              />
            </View>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputIcon,
                  { backgroundColor: UNO_COLORS.yellow },
                ]}
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
                placeholder="CREATE PASSCODE"
                placeholderTextColor={isDark ? "#666" : "#AAA"}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => (btnScale.value = withTiming(0.95))}
              onPressOut={() => (btnScale.value = withSpring(1))}
              style={styles.loginBtn}
              onPress={() => router.replace("/(tabs)")}
            >
              <View style={styles.btnShadow} />
              <View style={styles.btnFace}>
                <Text style={styles.loginBtnText}>JOIN TABLE</Text>
                <Ionicons name="enter" size={24} color="#FFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={[styles.orText, { color: theme.icon }]}>
                OR CONNECT
              </Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
              <View style={styles.googleIconBox}>
                <FontAwesome name="google" size={24} color={UNO_COLORS.red} />
              </View>
              <Text style={styles.googleText}>GOOGLE SIGN-UP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={[styles.footerText, { color: theme.text }]}>
                ALREADY A PLAYER? <Text style={styles.signUpLink}>LOGIN</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  scrollInner: { flexGrow: 1, justifyContent: "center" },
  bgCircle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.25,
  },
  inner: { padding: 25, paddingVertical: 50 },
  header: { marginBottom: 40, alignItems: "center" },
  closeBtn: { position: "absolute", top: -30, left: -10, zIndex: 10 },
  titleWrapper: { transform: [{ rotate: "-6deg" }] },
  titleMain: {
    fontSize: 50,
    fontWeight: "900",
    color: UNO_COLORS.green,
    letterSpacing: -2,
    textShadowColor: "#FFF",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  titleShadow: {
    position: "absolute",
    fontSize: 50,
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
    borderRadius: 15,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
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
    borderColor: "#000",
    borderLeftWidth: 0,
  },
  loginBtn: { height: 70, marginTop: 15 },
  btnShadow: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "90%",
    backgroundColor: "#006400",
    borderRadius: 15,
  },
  btnFace: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "90%",
    backgroundColor: UNO_COLORS.green,
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
  footer: { alignItems: "center", marginTop: 50, marginBottom: 20 },
  footerText: { fontWeight: "900", fontSize: 14 },
  signUpLink: { color: UNO_COLORS.red, textDecorationLine: "underline" },
});
