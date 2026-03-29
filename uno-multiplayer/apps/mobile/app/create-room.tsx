import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export default function CreateRoom() {
  const { isDark, theme } = useTheme();
  const router = useRouter();
  const [players, setPlayers] = useState(4);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#F5F5F5" },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={32} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>NEW TABLE</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>PLAYER CAPACITY</Text>
        <View style={styles.row}>
          {[2, 3, 4, 6].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => setPlayers(num)}
              style={[styles.numBtn, players === num && styles.activeNumBtn]}
            >
              <Text
                style={[styles.numText, players === num && { color: "#FFF" }]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => router.push("/waiting-room")}
      >
        <Text style={styles.createBtnText}>GENERATE ROOM</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "900" },
  section: { marginTop: 40 },
  label: { fontWeight: "900", opacity: 0.5, marginBottom: 20 },
  row: { flexDirection: "row", gap: 15 },
  numBtn: {
    flex: 1,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },
  activeNumBtn: {
    backgroundColor: "#005697",
    borderWidth: 2,
    borderColor: "#000",
  },
  numText: { fontSize: 20, fontWeight: "900" },
  createBtn: {
    marginTop: "auto",
    marginBottom: 40,
    height: 70,
    backgroundColor: "#ED1C24",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
  },
  createBtnText: { color: "#FFF", fontSize: 20, fontWeight: "900" },
});
