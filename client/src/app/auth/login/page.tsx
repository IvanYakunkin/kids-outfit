"use client";

import { useAppDispatch } from "@/redux/hooks";
import { loginThunk } from "@/redux/thunks/loginThunk";
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

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      dispatch(loginThunk({ phone, password }))
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
            Войти в аккаунт
          </Typography>

          <form onSubmit={handleLoginSubmit}>
            <TextField
              label="Телефон"
              name="phone"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Войти
            </Button>
            <Typography color="error" sx={{ mt: "15px" }} align="center">
              {error}
            </Typography>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            Нет аккаунта?{" "}
            <MUILink
              component={NextLink}
              href="/auth/registration"
              underline="hover"
              color="primary"
            >
              Зарегистрироваться
            </MUILink>
          </Typography>
        </Box>
      </Container>
    </main>
  );
}
