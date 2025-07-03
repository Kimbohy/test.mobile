import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

interface AuthContextType {
  signIn: ({
    email,
    password,
  }: {
    email: string;
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
    if (email === "u@u.com" && password === "password") {
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

  const signOut = async () => {
    await AsyncStorage.removeItem("userToken");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, userToken, loading }}>
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
