import { AuthResponseDto } from "@/types/users";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { initialState as authInitialState } from "./authSlice";

export function makeStore(user?: AuthResponseDto | null | false) {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: user
      ? {
          auth: {
            ...authInitialState,
            user,
          },
        }
      : undefined,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
