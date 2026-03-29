import React from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter, usePathname } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const { width } = Dimensions.get("window");

const UNO_COLORS = {
  red: "#ED1C24",
  blue: "#005697",
};

export default function BottomDock() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const pathname = usePathname(); // Detects which page we are on

  // Helper to determine if a tab is active
  const isActive = (route: string) => pathname === route;

  const NavItem = ({
    icon,
    activeIcon,
    route,
  }: {
    icon: any;
    activeIcon: any;
    route: string;
  }) => (
    <TouchableOpacity
      style={styles.dockItem}
      onPress={() => router.push(route)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isActive(route) ? activeIcon : icon}
        size={26}
        color={isActive(route) ? UNO_COLORS.red : theme.icon}
      />
      {isActive(route) && <View style={styles.activeDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.bottomDock}>
      <BlurView
        intensity={isDark ? 40 : 80}
        tint={isDark ? "dark" : "light"}
        style={styles.dockInner}
      >
        <NavItem icon="home-outline" activeIcon="home" route="/home" />
        <NavItem icon="card-outline" activeIcon="card" route="/inventory" />
        <NavItem icon="cart-outline" activeIcon="cart" route="/shop" />
        <NavItem
          icon="settings-outline"
          activeIcon="settings"
          route="/settings"
        />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomDock: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingHorizontal: 25,
    zIndex: 100, // Ensure it stays on top
  },
  dockInner: {
    height: 70,
    borderRadius: 35,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  dockItem: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    position: "absolute",
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: UNO_COLORS.red,
  },
});
