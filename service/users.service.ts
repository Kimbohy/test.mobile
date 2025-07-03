import { mockUsers } from "@/data/users";

export const validateUser = (email: string, password: string): boolean => {
  if (!email || !password) {
    return false;
  }
  return (
    mockUsers.filter(
      (user) => user.email === email && user.password === password
    ).length > 0
  );
};

export const createUser = (email: string, name: string, password: string) => {
  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    name,
    password,
  };
  mockUsers.push(newUser);
  return newUser;
};
