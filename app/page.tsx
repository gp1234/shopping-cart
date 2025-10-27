"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { UserRoles } from "@/data/users";
import { roleRoutes } from "@/lib/auth/roleConfig";

export default function HomeRedirect() {
  const router = useRouter();
  const token = useUserStore((s) => s.token);
  const role = useUserStore((s) => s.user?.role);
  const hasHydrated = useUserStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    const target = role ? roleRoutes[role as UserRoles] : "/login";
    router.replace(target);
  }, [hasHydrated, token, role, router]);

  return null;
}
