import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { createUser, validateUser } from "@/service/users.service";

interface AuthContextType {
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signUp: ({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  userToken: string | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) setUserToken(token);
      } catch (error) {
        console.error("Failed to load user token:", error);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const valid = await validateUser(email, password);

    if (valid) {
      const token = "fake-token";
      await AsyncStorage.setItem("userToken", token);
      setUserToken(token);
    } else {
      Alert.alert(
        "Invalid credentials",
        "Please check your email and password and try again."
      );
    }
  };

  const signUp = async ({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) => {
    const newUser = await createUser(email, name, password);
    if (newUser) {
      Alert.alert("Success", "User created successfully.");
      const token = "fake-token";
      await AsyncStorage.setItem("userToken", token);
      setUserToken(token);
    } else {
      Alert.alert("Error", "Failed to create user.");
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("userToken");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, signUp, userToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
