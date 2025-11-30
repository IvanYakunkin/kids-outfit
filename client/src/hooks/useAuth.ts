"use client";

import { setUser } from "@/redux/authSlice";
import { checkAuthRequest } from "@/shared/checkAuthRequest";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function useAuth({ hasRefresh = true }: { hasRefresh?: boolean }) {
  const dispatch = useDispatch();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const checkAuthResponse = await checkAuthRequest(hasRefresh);

      if (checkAuthResponse.ok && checkAuthResponse.user) {
        dispatch(setUser(checkAuthResponse.user));
        setAuthorized(true);
        return;
      }

      setAuthorized(false);
    }
    checkAuth();
  }, [dispatch, hasRefresh]);

  return authorized;
}
