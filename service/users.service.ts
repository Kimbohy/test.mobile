import { mockUsers } from "@/data/users";
import { User } from "@/types/user.type";
import * as Crypto from "expo-crypto";

const hashPassword = async (password: string): Promise<string> => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + "salt_string", // Adding a simple salt
    { encoding: Crypto.CryptoEncoding.HEX }
  );
};

export const validateUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  if (!email || !password) {
    return null;
  }

  const hashedPassword = await hashPassword(password);
  const user = mockUsers.find(
    (user) => user.email === email && user.password === hashedPassword
  );
  return user || null;
};

export const createUser = async (
  email: string,
  name: string,
  password: string
): Promise<User | null> => {
  const hashedPassword = await hashPassword(password);

  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    name,
    password: hashedPassword,
  };
  mockUsers.push(newUser);
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
};

export const updateUser = async (
  userId: string,
  updatedData: { name?: string; email?: string; password?: string }
): Promise<User | null> => {
  const userIndex = mockUsers.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  const user = mockUsers[userIndex];

  // Update the user data
  if (updatedData.name) {
    user.name = updatedData.name;
  }

  if (updatedData.email) {
    user.email = updatedData.email;
  }

  if (updatedData.password) {
    user.password = await hashPassword(updatedData.password);
  }

  mockUsers[userIndex] = user;

  // Return user without password
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};

export const updateUserStats = async (userId: string): Promise<boolean> => {
  try {
    const userIndex = mockUsers.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return false;
    }

    const user = mockUsers[userIndex];

    // If user doesn't have stats, create new ones
    if (!user.stat) {
      user.stat = {
        created: 1,
      };
    } else {
      // If user has stats, increment created count and update timestamp
      user.stat.created += 1;
    }

    mockUsers[userIndex] = user;
    return true;
  } catch (error) {
    console.error("Error updating user stats:", error);
    return false;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const user = mockUsers.find((user) => user.id === userId);
    if (!user) {
      return null;
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      stat: user.stat,
    };
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};
