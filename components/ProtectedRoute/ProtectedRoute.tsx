"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { UserRoles } from "@/data/users";
import { roleRoutes } from "@/lib/auth/roleConfig";
import { routePermissions } from "@/lib/auth/routePermissions";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useUserStore((s) => s.token);
  const user = useUserStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    setHydrated(useUserStore.persist.hasHydrated());
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    const matched = Object.keys(routePermissions).find((r) =>
      pathname.startsWith(r)
    );

    if (matched) {
      const allowedRoles = routePermissions[matched];
      const currentRole = user?.role as UserRoles | undefined;

      if (!allowedRoles.includes(currentRole!)) {
        const fallback = currentRole ? roleRoutes[currentRole] : "/login";
        router.replace(fallback);
      }
    }
  }, [hydrated, token, user?.role, pathname, router]);

  if (!hydrated) return null;
  if (!token) return null;

  const matched = Object.keys(routePermissions).find((r) =>
    pathname.startsWith(r)
  );
  const allowedRoles = matched ? routePermissions[matched] : [];
  const currentRole = user?.role as UserRoles | undefined;

  if (matched && !allowedRoles.includes(currentRole!)) return null;

  return <>{children}</>;
}
