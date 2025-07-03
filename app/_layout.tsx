import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "./global.css";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import { useRouter, useSegments } from "expo-router";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Composant pour protéger les routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userToken, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check if user is in auth routes
    const inAuthGroup = segments[0] === "auth";

    if (!userToken && !inAuthGroup) {
      // User not logged in and not in auth group, redirect to auth
      router.replace("/auth");
    } else if (userToken && inAuthGroup) {
      // User is logged in but in auth group, redirect to tabs
      router.replace("/(tabs)");
    }
  }, [userToken, loading, segments, router]);

  if (loading) {
    return null; // or a loading screen
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ProtectedRoute>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="Detail" options={{ headerShown: true }} />
        </Stack>
      </ProtectedRoute>
    </ThemeProvider>
  );
}
