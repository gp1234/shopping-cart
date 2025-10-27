export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
}

export type User = {
  id: string;
  email: string;
  password: string;
  role: UserRoles;
  tier?: number;
};

export const users: User[] = [
  {
    id: "1",
    email: "gio@example.com",
    password: "password123",
    role: UserRoles.USER,
    tier: 2,
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "password123",
    role: UserRoles.ADMIN,
  },
];
