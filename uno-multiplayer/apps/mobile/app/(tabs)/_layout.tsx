import { Tabs, usePathname } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const { theme } = useTheme();
  const pathname = usePathname();

  // Check if we are on the welcome screen (index)
  // In Expo Router, the root of a group is often just "/"
  // or the name of the folder if accessed directly.
  const isWelcomeScreen = pathname === "/" || pathname === "/index";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 0,
          elevation: 0,
          // HIDE NAVBAR ONLY FOR WELCOME SCREEN
          display: isWelcomeScreen ? "none" : "flex",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Play",
          tabBarIcon: ({ color }) => (
            <Ionicons name="card" size={24} color={color} />
          ),
        }}
      />

      {/* Example of another tab where the navbar WILL show */}
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
