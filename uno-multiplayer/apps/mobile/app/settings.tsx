import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const UNO_COLORS = {
  red: "#ED1C24",
  blue: "#005697",
  green: "#00A651",
  yellow: "#FFDE00",
  darkSurface: "#1A1A1A",
  lightSurface: "#FFFFFF",
};

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme(); // Assuming toggleTheme is in your context
  const router = useRouter();

  const SettingItem = ({ icon, label, rightElement, delay = 0 }: any) => (
    <Animated.View
      entering={FadeInRight.delay(delay).springify()}
      style={[
        styles.settingItem,
        {
          backgroundColor: isDark ? "#111" : "#FFF",
          borderColor: isDark ? "#333" : "#DDD",
        },
      ]}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isDark ? "#222" : "#F0F0F0" },
          ]}
        >
          <Ionicons name={icon} size={22} color={isDark ? "#FFF" : "#000"} />
        </View>
        <Text style={[styles.settingLabel, { color: theme.text }]}>
          {label}
        </Text>
      </View>
      {rightElement}
    </Animated.View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#F5F5F5" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          SETTINGS
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* THEME SWITCHER (The "Game Mode" Look) */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          VISUAL THEME
        </Text>
        <View style={styles.themeGrid}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => !isDark && toggleTheme()}
            style={[
              styles.themeCard,
              isDark && styles.activeThemeCard,
              { backgroundColor: "#1A1A1A" },
            ]}
          >
            <MaterialCommunityIcons
              name="moon-waning-crescent"
              size={32}
              color="#FFF"
            />
            <Text style={styles.themeCardText}>DARK MODE</Text>
            {isDark && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={UNO_COLORS.green}
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => isDark && toggleTheme()}
            style={[
              styles.themeCard,
              !isDark && styles.activeThemeCard,
              { backgroundColor: "#FFF", borderColor: "#DDD", borderWidth: 1 },
            ]}
          >
            <MaterialCommunityIcons
              name="white-balance-sunny"
              size={32}
              color="#000"
            />
            <Text style={[styles.themeCardText, { color: "#000" }]}>
              LIGHT MODE
            </Text>
            {!isDark && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={UNO_COLORS.green}
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* GAME PREFERENCES */}
        <Text
          style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}
        >
          GAMEPLAY
        </Text>
        <SettingItem
          icon="volume-high"
          label="Sound Effects"
          delay={100}
          rightElement={
            <Switch value={true} trackColor={{ true: UNO_COLORS.green }} />
          }
        />
        <SettingItem
          icon="musical-notes"
          label="Menu Music"
          delay={200}
          rightElement={
            <Switch value={false} trackColor={{ true: UNO_COLORS.green }} />
          }
        />
        <SettingItem
          icon="notifications"
          label="Match Alerts"
          delay={300}
          rightElement={
            <Switch value={true} trackColor={{ true: UNO_COLORS.green }} />
          }
        />

        {/* ACCOUNT */}
        <Text
          style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}
        >
          ACCOUNT
        </Text>
        <SettingItem
          icon="person-outline"
          label="Edit Profile"
          delay={400}
          rightElement={
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          }
        />
        <SettingItem
          icon="shield-checkmark-outline"
          label="Privacy & Security"
          delay={500}
          rightElement={
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          }
        />

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.logoutText}>SIGN OUT OF TABLE</Text>
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.versionText}>UNO MOBILE v1.0.4-BETA</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "900", letterSpacing: 1 },
  backBtn: { padding: 5 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 15,
    opacity: 0.6,
  },

  themeGrid: { flexDirection: "row", gap: 15 },
  themeCard: {
    flex: 1,
    height: 110,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    position: "relative",
  },
  activeThemeCard: { borderWidth: 3, borderColor: UNO_COLORS.blue },
  themeCardText: { color: "#FFF", fontWeight: "900", fontSize: 12 },
  checkIcon: { position: "absolute", top: 10, right: 10 },

  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 15 },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: { fontSize: 15, fontWeight: "700" },

  logoutBtn: {
    marginTop: 40,
    height: 65,
    backgroundColor: UNO_COLORS.red,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 3,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  logoutText: { color: "#FFF", fontSize: 16, fontWeight: "900" },
  versionText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 10,
    fontWeight: "700",
    opacity: 0.3,
    letterSpacing: 1,
  },
});
