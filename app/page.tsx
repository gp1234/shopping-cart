"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { UserRoles } from "@/lib/data/users";

export default function HomeRedirect() {
  const router = useRouter();
  const token = useUserStore((state) => state.token);
  const role = useUserStore((state) => state.user?.role);
  const hasHydrated = useUserStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (token && role === UserRoles.USER) router.replace("/products");
    else if (token && role === UserRoles.ADMIN) router.replace("/dashboard");
    else router.replace("/login");
  }, [token, role, hasHydrated, router]);

  return null;
}
