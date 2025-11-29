"use client";

import { useAuth } from "@/hooks/useAuthRefresh";

export function AppClientWrapper({ children }: { children: React.ReactNode }) {
  useAuth();

  return <>{children}</>;
}
