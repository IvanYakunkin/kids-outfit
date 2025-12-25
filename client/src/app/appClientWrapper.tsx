"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTracker } from "@/hooks/useTracker";

export function AppClientWrapper({
  children,
  hasRefresh,
}: {
  children: React.ReactNode;
  hasRefresh: boolean;
}) {
  useAuth({ hasRefresh });
  useTracker();

  return <>{children}</>;
}
