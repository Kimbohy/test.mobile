import { useAuthContext } from "@/context/AuthContext";
import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const Login = () => {
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    signIn({ email, password });
  };

  return (
    <View className="items-center justify-center flex-1 w-full p-3 bg-gray-50">
      <View className="w-full">
        <Text className="mb-8 text-3xl font-bold text-center text-gray-800">
          Bienvenue
        </Text>

        <View className="gap-5 space-y-4">
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            className="w-full p-4 text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white"
          />
          <TextInput
            placeholder="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="w-full p-4 text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 focus:bg-white"
          />
        </View>

        <TouchableOpacity
          onPress={handleSignIn}
          className="w-full py-4 mt-6 transition-transform bg-blue-600 rounded-lg shadow-md active:bg-blue-700 active:scale-95"
        >
          <Text className="text-lg font-semibold text-center text-white">
            Connexion
          </Text>
        </TouchableOpacity>

        <Link href={"/auth/signup"} className="mt-4">
          <Text className="text-sm text-center text-blue-600">
            Pas de compte? Créer un compte
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default Login;
