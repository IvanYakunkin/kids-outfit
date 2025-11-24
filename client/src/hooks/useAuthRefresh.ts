"use client";

import { setUser } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useAuthRefresh(hasRefreshToken: boolean) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    async function refresh() {
      // User is found by access token
      if (user || user === false) return;

      if (!hasRefreshToken) {
        dispatch(setUser(false));
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const user = await res.json();
        dispatch(setUser(user));
      } else {
        dispatch(setUser(false));
      }
    }
    refresh();
  }, [user, dispatch, hasRefreshToken]);
}
