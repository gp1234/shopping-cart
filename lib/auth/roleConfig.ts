import { UserRoles } from "@/lib/data/users";

export const roleRoutes: Record<UserRoles, string> = {
  [UserRoles.ADMIN]: "/dashboard",
  [UserRoles.USER]: "/products",
};
