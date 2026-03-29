import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import BottomDock from "@/components/BottomDock";

const DATA = [
  { rank: 1, name: "KillerPro", score: 12500 },
  { rank: 2, name: "Amit_Singh", score: 11200 },
  { rank: 3, name: "UnoMaster", score: 9800 },
];

export default function Leaderboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TOP PLAYERS</Text>
      <FlatList
        data={DATA}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.rankItem}>
            <Text style={styles.rankText}>#{item.rank}</Text>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.scoreText}>{item.score} pts</Text>
          </View>
        )}
      />
      <BottomDock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 60,
  },
  rankItem: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#111",
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  rankText: { color: "#FFDE00", fontWeight: "900", width: 40 },
  nameText: { color: "#FFF", flex: 1, fontWeight: "700" },
  scoreText: { color: "#00A651", fontWeight: "900" },
});
