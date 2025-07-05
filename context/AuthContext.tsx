import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import {
  createUser,
  validateUser,
  updateUser,
  getUserById,
} from "@/service/users.service";
import { createToken, connectedUser } from "@/util/token";

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
  updateProfile: (updatedData: {
    name?: string;
    email?: string;
    password?: string;
  }) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
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
    const user = await validateUser(email, password);

    if (user) {
      const token = createToken(user);

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
      const token = createToken(newUser);
      await AsyncStorage.setItem("userToken", token);
      setUserToken(token);
    } else {
      Alert.alert("Error", "Failed to create user.");
    }
  };

  const updateProfile = async (updatedData: {
    name?: string;
    email?: string;
    password?: string;
  }): Promise<boolean> => {
    if (!userToken) {
      Alert.alert("Error", "No user logged in");
      return false;
    }

    const currentUser = connectedUser(userToken);
    if (!currentUser) {
      Alert.alert("Error", "Invalid user token");
      return false;
    }

    const updatedUser = await updateUser(currentUser.id, updatedData);
    if (updatedUser) {
      // Create new token with updated user data
      const newToken = createToken(updatedUser);
      await AsyncStorage.setItem("userToken", newToken);
      setUserToken(newToken);
      Alert.alert("Success", "Profile updated successfully");
      return true;
    } else {
      Alert.alert("Error", "Failed to update profile");
      return false;
    }
  };

  const refreshUserData = async () => {
    if (!userToken) {
      return;
    }

    const currentUser = connectedUser(userToken);
    if (!currentUser) {
      return;
    }

    // Get updated user data from the service
    const updatedUser = await getUserById(currentUser.id);
    if (updatedUser) {
      // Create new token with updated user data
      const newToken = createToken(updatedUser);
      await AsyncStorage.setItem("userToken", newToken);
      setUserToken(newToken);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("userToken");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        signUp,
        updateProfile,
        refreshUserData,
        userToken,
        loading,
      }}
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
