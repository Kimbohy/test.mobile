export type UserData = {
  id: string;
  email: string;
  name: string;
  password: string;
  stat?: {
    created: number;
  };
};

export type User = Omit<UserData, "password">;
