import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

const { width } = Dimensions.get("window");

const SCREENS = [
  {
    group: "AUTH & ONBOARDING",
    items: [
      { name: "Splash Screen", route: "/" },
      { name: "Login", route: "/login" },
      { name: "Username Setup", route: "/setup-profile" }, // To be created
    ],
  },
  {
    group: "MAIN LOBBY",
    items: [
      { name: "Home Dashboard", route: "/home" },
      { name: "Matchmaking", route: "/lobby" },
      { name: "Create Room", route: "/create-room" },
      { name: "Waiting Room", route: "/waiting-room" },
    ],
  },
  {
    group: "CORE GAMEPLAY",
    items: [
      { name: "Main Game Table", route: "/game" },
      { name: "Game Results", route: "/results" },
    ],
  },
  {
    group: "SOCIAL & META",
    items: [
      { name: "Leaderboard", route: "/leaderboard" },
      { name: "Settings", route: "/settings" },
      { name: "User Profile", route: "/profile" }, // To be created
    ],
  },
];

export default function DevShowcase() {
  const { isDark, theme } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#F5F5F5" },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          🛠️ UI SHOWCASE
        </Text>
        <Text style={styles.subtitle}>PREVIEW ALL PRODUCTION SCREENS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {SCREENS.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.group}</Text>
            <View style={styles.grid}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? "#111" : "#FFF",
                      borderColor: isDark ? "#333" : "#DDD",
                    },
                  ]}
                  onPress={() => router.push(item.route as any)}
                >
                  <Ionicons name="layers-outline" size={20} color="#ED1C24" />
                  <Text style={[styles.cardText, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={theme.icon}
                    style={styles.arrow}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.version}>UNO MOBILE PREVIEW MODE</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "900", letterSpacing: 1 },
  subtitle: {
    color: "#ED1C24",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 4,
  },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  section: { marginTop: 30 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    opacity: 0.5,
    letterSpacing: 1.5,
    marginBottom: 15,
  },

  grid: { gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: { flex: 1, marginLeft: 12, fontWeight: "700", fontSize: 15 },
  arrow: { opacity: 0.3 },

  footer: { marginTop: 50, alignItems: "center" },
  version: { fontSize: 10, fontWeight: "800", opacity: 0.2, letterSpacing: 1 },
});
