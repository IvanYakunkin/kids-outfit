"use client";
import { useAppDispatch } from "@/redux/hooks";
import { registrationThunk } from "@/redux/thunks/registrationThunk";
import { CreateUserDto } from "@/types/users";
import {
  Box,
  Button,
  Container,
  Link as MUILink,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Registration() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const handleRegistrationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);

      const firstname = formData.get("firstname")?.toString().trim();
      const lastname = formData.get("lastname")?.toString().trim();
      const middlename = formData.get("middlename")?.toString().trim();
      const phone = formData.get("phone")?.toString().trim();
      const password = formData.get("password")?.toString();
      const passwordConfirm = formData.get("passwordConfirm");

      if (
        !firstname ||
        !lastname ||
        !middlename ||
        !phone ||
        !password ||
        !passwordConfirm
      ) {
        setError("Заполните поля");
        return;
      }

      if (password !== passwordConfirm) {
        setError("Пароли не совпадают!");
        return;
      }

      const registrationData: CreateUserDto = {
        firstname: firstname,
        lastname,
        middlename,
        phone,
        password,
      };

      dispatch(registrationThunk({ registrationData }))
        .unwrap()
        .then(() => router.push("/"))
        .catch((e) => {
          setError(Array.isArray(e) ? e[0] : e);
        });
    } catch (e) {
      console.log(e);
      setError(`Серверная ошибка`);
    }
  };

  return (
    <main>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Создать аккаунт
          </Typography>

          <form onSubmit={handleRegistrationSubmit}>
            <TextField
              label="Фамилия"
              name="lastname"
              variant="outlined"
              fullWidth
              margin="normal"
              type="text"
              error={!!error}
              required
            />
            <TextField
              label="Имя"
              name="firstname"
              variant="outlined"
              fullWidth
              margin="normal"
              type="text"
              error={!!error}
              required
            />
            <TextField
              label="Отчество"
              name="middlename"
              variant="outlined"
              fullWidth
              margin="normal"
              type="text"
              error={!!error}
            />
            <TextField
              label="Телефон"
              name="phone"
              variant="outlined"
              fullWidth
              margin="normal"
              type="tel"
              error={!!error}
              required
            />
            <TextField
              label="Пароль"
              name="password"
              variant="outlined"
              fullWidth
              error={!!error}
              margin="normal"
              type="password"
              required
            />
            <TextField
              label="Подтверждение пароля"
              name="passwordConfirm"
              variant="outlined"
              fullWidth
              error={!!error}
              margin="normal"
              type="password"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                background: "var(--templatePurple)",
                "&:hover": { backgroundColor: "var(--templatePurpleHover)" },
              }}
            >
              Создать аккаунт
            </Button>
            <Typography color="error" sx={{ mt: "15px" }} align="center">
              {error}
            </Typography>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            Есть аккаунт?{" "}
            <MUILink
              component={NextLink}
              href="/auth/login"
              underline="hover"
              color="primary"
            >
              Войти
            </MUILink>
          </Typography>
        </Box>
      </Container>
    </main>
  );
}
