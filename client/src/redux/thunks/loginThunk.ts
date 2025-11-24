import { fetchJson, FetchJsonResult } from "@/shared/api/fetchJson";
import { AuthResponseDto } from "@/types/users";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk<
  AuthResponseDto,
  { phone: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ phone, password }, thunkAPI) => {
  try {
    const response: FetchJsonResult<AuthResponseDto> = await fetchJson(
      "auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
        credentials: "include",
      }
    );

    if (response.ok && (response.status === 201 || response.status === 200)) {
      return response.data as AuthResponseDto;
    } else {
      return thunkAPI.rejectWithValue(response.error || "Ошибка авторизации");
    }
  } catch (err) {
    console.log("Ошибка авторизации", err);
    return thunkAPI.rejectWithValue("Ошибка сервера");
  }
});
