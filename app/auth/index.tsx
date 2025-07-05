import CustomTextInput from "@/components/shared/CustomTextInput";
import { useAuthContext } from "@/context/AuthContext";
import { signinSchema } from "@/schema/auth.schema";
import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useFormValidation } from "@/hooks/useFormValidation";

const Login = () => {
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { errors, validateField, validateForm, clearFieldError } =
    useFormValidation(signinSchema);

  const handleSignIn = () => {
    // Use a partial schema validation since we don't need name for sign-in
    const isValid = validateForm({ email, password });
    if (isValid) {
      signIn({ email, password });
    }
  };

  return (
    <View className="items-center justify-center flex-1 w-full p-3 bg-gray-50 dark:bg-gray-900">
      <View className="w-full">
        <Text className="mb-8 text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Bienvenue
        </Text>

        <View className="gap-5 space-y-4">
          <CustomTextInput
            placeholder="Email"
            fieldName="email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearFieldError("email");
            }}
            validator={validateField}
            variant="auth"
            error={errors.email}
          />
          <CustomTextInput
            placeholder="Mot de passe"
            fieldName="password"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearFieldError("password");
            }}
            validator={validateField}
            variant="auth"
            error={errors.password}
          />
        </View>

        <TouchableOpacity
          onPress={handleSignIn}
          className="w-full py-4 mt-6 transition-transform bg-blue-600 rounded-lg shadow-md dark:bg-blue-700 active:bg-blue-700 dark:active:bg-blue-800 active:scale-95"
        >
          <Text className="text-lg font-semibold text-center text-white">
            Connexion
          </Text>
        </TouchableOpacity>

        <Link href={"/auth/signup"} className="mt-4">
          <Text className="text-sm text-center text-blue-600 dark:text-blue-400">
            Pas de compte? Créer un compte
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default Login;
