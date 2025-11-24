import { AuthResponseDto } from "@/types/users";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginThunk } from "./thunks/loginThunk";
import { logoutThunk } from "./thunks/logoutThunk";
import { registrationThunk } from "./thunks/registrationThunk";

type UserType = AuthResponseDto | null | false;

interface AuthState {
  user: UserType;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка входа";
      });

    // Registration
    builder
      .addCase(registrationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registrationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registrationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка регистрации";
      });

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Ошибка выхода";
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
