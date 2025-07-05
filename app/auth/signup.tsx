import { useAuthContext } from "@/context/AuthContext";
import { signupSchema } from "@/schema/auth.schema";
import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import CustomTextInput from "@/components/shared/CustomTextInput";
import { useFormValidation } from "@/hooks/useFormValidation";

const Signup = () => {
  const { signUp } = useAuthContext();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { errors, validateField, validateForm, clearFieldError } =
    useFormValidation(signupSchema);

  const handleSignUp = () => {
    const isValid = validateForm({ email, name, password });
    if (isValid) {
      signUp({ email, name, password });
    }
  };

  return (
    <View className="items-center justify-center flex-1 w-full p-3 bg-gray-50 dark:bg-gray-900">
      <View className="w-full">
        <Text className="mb-8 text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Créer un Compte
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
            placeholder="Nom"
            fieldName="name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearFieldError("name");
            }}
            validator={validateField}
            variant="auth"
            error={errors.name}
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
          onPress={handleSignUp}
          className="w-full py-4 mt-6 transition-transform bg-blue-600 dark:bg-blue-700 rounded-lg shadow-md active:bg-blue-700 dark:active:bg-blue-800 active:scale-95"
        >
          <Text className="text-lg font-semibold text-center text-white">
            Connexion
          </Text>
        </TouchableOpacity>

        <Link href={"/auth"} className="mt-4">
          <Text className="text-sm text-center text-blue-600 dark:text-blue-400">
            Déja un compte? Se connecter
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default Signup;
