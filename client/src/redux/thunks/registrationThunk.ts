import { fetchJson, FetchJsonResult } from "@/shared/fetchJson";
import { AuthResponseDto, CreateUserDto } from "@/types/users";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registrationThunk = createAsyncThunk<
  AuthResponseDto,
  { registrationData: CreateUserDto },
  { rejectValue: string }
>("auth/registration", async (registrationData, thunkAPI) => {
  try {
    const response: FetchJsonResult<AuthResponseDto> = await fetchJson(
      "auth/registration",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData.registrationData),
        credentials: "include",
      }
    );

    if (response.ok && (response.status === 201 || response.status === 200)) {
      return response.data as AuthResponseDto;
    } else {
      return thunkAPI.rejectWithValue(response.error || "Ошибка регистрации");
    }
  } catch (err) {
    console.log("Ошибка регистрации", err);
    return thunkAPI.rejectWithValue("Ошибка сервера");
  }
});
