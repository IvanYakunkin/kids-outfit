"use client";

import { logVisit } from "@/shared/api/analytics";
import { useEffect } from "react";

export function useTracker() {
  useEffect(() => {
    async function performLogVisit() {
      await logVisit();
    }
    performLogVisit();
  }, []);
}
