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
