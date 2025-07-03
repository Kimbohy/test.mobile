import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { useAuthContext } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { signOut } = useAuthContext();
  const handleSignOut = () => {
    signOut();
  };
  return (
    <View>
      <Text className="text-2xl font-bold dark:text-white">Profile</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Deconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}
