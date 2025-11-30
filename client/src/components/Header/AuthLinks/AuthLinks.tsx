"use client";

import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { logoutThunk } from "@/redux/thunks/logoutThunk";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import styles from "./AuthLinks.module.css";

export default function AuthLinks({ isRefresh }: { isRefresh: boolean }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await dispatch(logoutThunk());

    if (logoutThunk.fulfilled.match(result)) {
      router.push("/auth/login");
    } else {
      console.error("Ошибка выхода:", result.payload);
    }
  };

  return (
    <div className={styles.auth}>
      {user || isRefresh ? (
        <>
          <Link href="/cart/" className={styles.link}>
            <Image
              src="/images/basket.png"
              width={24}
              height={24}
              alt="Корзина"
            />
            <span>Корзина</span>
          </Link>
          <div className={styles.link} onClick={handleLogout}>
            <Image
              src="/images/logout.png"
              width={24}
              height={24}
              alt="Выйти"
            />
            <span>Выйти</span>
          </div>
          {user && user.isAdmin && (
            <Link href="/admin" className={styles.link}>
              <Image
                src="/images/settings.png"
                width={24}
                height={24}
                alt="Админ"
              />
              <span>Админ</span>
            </Link>
          )}
        </>
      ) : (
        <Link href="/auth/login/" className={styles.link}>
          <Image src="/images/login.png" width={24} height={24} alt="Вход" />
          Войти
        </Link>
      )}
    </div>
  );
}
