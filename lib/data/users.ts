export type Role = "user" | "admin";

export type User = {
  id: string;
  email: string;
  password: string;
  role: Role;
  tier?: number;
};

export const users: User[] = [
  {
    id: "1",
    email: "gio@example.com",
    password: "password123",
    role: "user",
    tier: 1,
  },
];
