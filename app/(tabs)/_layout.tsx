import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        // couleurs des icônes
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: colorScheme === "dark" ? "#888888" : "#666666",
        // style de la barre
        tabBarStyle: {
          backgroundColor: theme.background, // fond adapté
          borderTopColor: colorScheme === "dark" ? "#333333" : "#e0e0e0", // séparateur
          elevation: colorScheme === "light" ? 4 : 0, // ombre Android
          shadowColor: colorScheme === "light" ? "#000" : undefined,
          shadowOpacity: colorScheme === "light" ? 0.1 : 0,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Produits",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="archive" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Créer",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
