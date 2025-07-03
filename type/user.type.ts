export type userData = {
  id: string;
  email: string;
  name: string;
  password: string;
};

export type user = Omit<userData, "password">;
