import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
// 1. Import the Root View
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    // 2. Wrap everything here
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Content />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function Content() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        initialRouteName="dev-showcase"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="dev-showcase" options={{ title: "Dev Preview" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Game Settings",
          }}
        />
        <Stack.Screen
          name="how-to-play"
          options={{
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </>
  );
}
