// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Colors } from "../theme"; // ✅ relative import (no "@/")

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      {/* Light theme → status bar text dark */}
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTitle: "CityHop",
          headerTintColor: Colors.text,                    // dark text
          headerStyle: { backgroundColor: Colors.tabBar }, // white header
          headerTitleStyle: { fontWeight: "800" },         // (no letterSpacing)
          contentStyle: { backgroundColor: Colors.bg },    // white page bg
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
