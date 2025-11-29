"use client";

import { setUser } from "@/redux/authSlice";
import { AuthResponseDto } from "@/types/users";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function useAuth() {
  const dispatch = useDispatch();
  //const user = useSelector((state: RootState) => state.auth.user);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const meResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/me`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (meResponse.ok) {
        const user: AuthResponseDto = await meResponse.json();
        dispatch(setUser(user));
        setAuthorized(true);
        return;
      }

      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        const user: AuthResponseDto = await refreshResponse.json();
        dispatch(setUser(user));
        setAuthorized(true);
        return;
      }

      setAuthorized(false);
    }
    checkAuth();
  }, [dispatch]);

  return authorized;
}
