import { UserRoles } from "@/data/users";

export const roleRoutes: Record<UserRoles, string> = {
  [UserRoles.ADMIN]: "/dashboard",
  [UserRoles.USER]: "/products",
};
