import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Animated, { FadeInUp, BounceIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function ResultScreen() {
  const router = useRouter();
  const isWinner = true; // This would come from your game state

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <View
        style={[
          styles.glow,
          { backgroundColor: isWinner ? "#FFDE00" : "#ED1C24" },
        ]}
      />

      <Animated.View
        entering={BounceIn.delay(300)}
        style={styles.trophyContainer}
      >
        <FontAwesome5
          name={isWinner ? "trophy" : "skull-crossbones"}
          size={100}
          color={isWinner ? "#FFDE00" : "#FFF"}
        />
      </Animated.View>

      <Animated.Text entering={FadeInUp.delay(500)} style={styles.resultTitle}>
        {isWinner ? "VICTORY!" : "DEFEAT..."}
      </Animated.Text>

      {/* Stats Summary Card */}
      <Animated.View entering={FadeInUp.delay(700)} style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>XP GAINED</Text>
          <Text style={styles.statValue}>+450 XP</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "75%" }]} />
        </View>

        <View style={[styles.statRow, { marginTop: 20 }]}>
          <Text style={styles.statLabel}>COINS EARNED</Text>
          <Text style={[styles.statValue, { color: "#FFDE00" }]}>+120</Text>
        </View>
      </Animated.View>

      {/* Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.playAgainBtn}
          onPress={() => router.replace("/lobby")}
        >
          <Text style={styles.playAgainText}>PLAY AGAIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.homeBtnText}>BACK TO MENU</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.2,
    filter: "blur(60px)",
  },
  trophyContainer: { marginBottom: 20 },
  resultTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFF",
    fontStyle: "italic",
    marginBottom: 40,
  },
  statsCard: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statLabel: { color: "#AAA", fontWeight: "700", fontSize: 12 },
  statValue: { color: "#FFF", fontWeight: "900", fontSize: 18 },
  progressBar: {
    height: 8,
    backgroundColor: "#222",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#00A651" },
  footer: { width: "100%", marginTop: 50, gap: 15 },
  playAgainBtn: {
    height: 70,
    backgroundColor: "#ED1C24",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
  },
  playAgainText: { color: "#FFF", fontSize: 20, fontWeight: "900" },
  homeBtn: {
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  homeBtnText: { color: "#AAA", fontWeight: "700" },
});
