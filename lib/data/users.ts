export type Role = "user" | "admin";

export type User = {
  id: string;
  email: string;
  password: string;
  role: Role;
  tier?: number;
};

export const users: User[] = [];
