import { UserRoles } from "@/data/users";

export const routePermissions: Record<string, UserRoles[]> = {
  "/dashboard": [UserRoles.ADMIN],
  "/products": [UserRoles.ADMIN, UserRoles.USER],
};
