"use client";

import { makeStore } from "@/redux/store";
import { AuthResponseDto } from "@/types/users";
import { Provider } from "react-redux";

export function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthResponseDto | null;
}) {
  const store = makeStore(user);

  return <Provider store={store}>{children}</Provider>;
}
