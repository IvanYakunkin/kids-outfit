"use client";

import { useAuth } from "@/hooks/useAuth";

export function AppClientWrapper({ children }: { children: React.ReactNode }) {
  useAuth();

  return <>{children}</>;
}
