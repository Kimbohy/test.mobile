import { User } from "@/types/user.type";
import JWT from "expo-jwt";

const secret = "secret-key"; // The secret key should be stored in an environment variable but for now it's OK

export const createToken = (user: User): string => {
  return JWT.encode(user, secret);
};

export const connectedUser = (token: string): User | null => {
  try {
    return JWT.decode<User>(token, secret);
  } catch (error) {
    return null;
  }
};
