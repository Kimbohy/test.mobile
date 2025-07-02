import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";

export default function ProfileScreen() {
  return (
    <View>
      <Text className="text-2xl font-bold dark:text-white">Profile</Text>
      <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}
