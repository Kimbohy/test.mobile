export type UserData = {
  id: string;
  email: string;
  name: string;
  password: string;
};

export type User = Omit<UserData, "password">;
