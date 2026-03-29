import { View, Text, StyleSheet, Switch } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Fonts } from "@/constants/theme";

export default function ModalScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <Text
          style={[styles.label, { color: theme.text, fontFamily: Fonts?.sans }]}
        >
          Dark Mode
        </Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: theme.tint }}
        />
      </View>

      <View style={styles.section}>
        <Text
          style={[styles.label, { color: theme.text, fontFamily: Fonts?.sans }]}
        >
          Sound Effects
        </Text>
        <Switch
          value={true}
          trackColor={{ false: "#767577", true: theme.tint }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  label: { fontSize: 16, fontWeight: "500" },
});
