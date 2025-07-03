import { mockUsers } from "@/data/users";
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
): Promise<boolean> => {
  if (!email || !password) {
    return false;
  }

  const hashedPassword = await hashPassword(password);

  return (
    mockUsers.filter(
      (user) => user.email === email && user.password === hashedPassword
    ).length > 0
  );
};

export const createUser = async (
  email: string,
  name: string,
  password: string
) => {
  const hashedPassword = await hashPassword(password);

  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    name,
    password: hashedPassword,
  };
  mockUsers.push(newUser);
  return newUser;
};
