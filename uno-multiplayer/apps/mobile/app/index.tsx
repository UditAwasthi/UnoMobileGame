import React, { useEffect } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
    // Simulate loading/auth check
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: "-10deg" }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ED1C24", "#8B0000"]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.logoCard, logoStyle]}>
        <Text style={styles.logoText}>UNO</Text>
      </Animated.View>
      <Animated.Text entering={FadeIn.delay(800)} style={styles.loadingText}>
        LOADING TABLE...
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoCard: {
    width: 180,
    height: 260,
    backgroundColor: "#FFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: "#000",
    elevation: 20,
  },
  logoText: {
    fontSize: 60,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#ED1C24",
    transform: [{ skewX: "-10deg" }],
  },
  loadingText: {
    position: "absolute",
    bottom: 50,
    color: "#FFF",
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 12,
  },
});
