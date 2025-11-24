import { createAsyncThunk } from "@reduxjs/toolkit";

export const logoutThunk = createAsyncThunk<boolean, void>(
  "auth/logoutThunk",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        return thunkAPI.rejectWithValue("Не удалось выйти из аккаунта");
      }

      return true;
    } catch (err: unknown) {
      let message = "Неизвестная ошибка";

      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);
