"use client";

import { useAuth } from "@/hooks/useAuth";

export function AppClientWrapper({
  children,
  hasRefresh,
}: {
  children: React.ReactNode;
  hasRefresh: boolean;
}) {
  useAuth({ hasRefresh });

  return <>{children}</>;
}
