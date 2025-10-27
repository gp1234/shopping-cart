export type Role = "user" | "admin";

export type User = {
  id: string;
  email: string;
  password: string;
  role: Role;
  tier?: number;
};

export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
}

export const users: User[] = [
  {
    id: "1",
    email: "gio@example.com",
    password: "password123",
    role: UserRoles.USER,
    tier: 3,
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "password123",
    role: UserRoles.ADMIN,
  },
];
