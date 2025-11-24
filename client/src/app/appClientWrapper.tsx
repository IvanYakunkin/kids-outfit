"use client";

import { useAuthRefresh } from "@/hooks/useAuthRefresh";

export function AppClientWrapper({
  children,
  hasRefreshToken,
}: {
  children: React.ReactNode;
  hasRefreshToken: boolean;
}) {
  useAuthRefresh(hasRefreshToken);

  return <>{children}</>;
}
