"use client";

import { setUser } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { logoutThunk } from "@/redux/thunks/logoutThunk";
import { CategoryDto } from "@/types/categories";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AdminMenu from "./AdminMenu/AdminMenu";
import styles from "./Navbar.module.css";
import { useNavbarContext } from "./NavbarContext";
import NavbarListElement from "./NavbarListElement";

interface NavbarProps {
  categories: CategoryDto[];
}

export default function Navbar({ categories }: NavbarProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [openMenuIds, setOpenMenuIds] = useState<number[]>([]);
  const { isOpen, closeNavbar } = useNavbarContext();
  const [render, setRender] = useState(false);
  const [animate, setAnimate] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setRender(true);
      });
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setAnimate(false);
      });
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const headerMenuTogglerBtn = document.getElementById(
        "headerMenuTogglerBtn"
      );
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !headerMenuTogglerBtn?.contains(event.target as Node)
      ) {
        closeNavbar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeNavbar, isOpen]);

  const logout = async () => {
    const result = await dispatch(logoutThunk());
    dispatch(setUser(null));

    if (logoutThunk.fulfilled.match(result)) {
      router.push("/auth/login");
    } else {
      console.error("Ошибка выхода:", result.payload);
    }
    closeNavbar();
  };

  if (!render) return null;

  return (
    <nav className={`${styles.navbar} ${animate ? styles.open : ""}`}>
      <div
        className={`${styles.menu} ${animate ? styles.open : ""}`}
        ref={menuRef}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.back} onClick={closeNavbar}>
              <Image
                src="/images/left-arrow.png"
                width={18}
                height={18}
                alt="Back"
              />
              Назад
            </div>
          </div>

          <div className={styles.categories}>
            <ul className={`${styles.list} ${styles.main}`}>
              <li>
                <Link href="/catalog/section?type=new" onClick={closeNavbar}>
                  Новинки
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog/section?type=popular"
                  onClick={closeNavbar}
                >
                  Хиты
                </Link>
              </li>
              <li>
                <Link href="/catalog/section?type=sale" onClick={closeNavbar}>
                  Распродажа
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.categories}>
            <ul className={`${styles.list} ${styles.main}`}>
              {categories.map((category) => (
                <NavbarListElement
                  key={category.id}
                  category={category}
                  openMenuIds={openMenuIds}
                  setOpenMenuIds={setOpenMenuIds}
                />
              ))}
            </ul>
          </div>
          <div className={styles.auth}>
            {user ? (
              <>
                {user.isAdmin && <AdminMenu closeNavbar={closeNavbar} />}

                <Link
                  href="/cart/"
                  className={styles.authElement}
                  onClick={closeNavbar}
                >
                  <Image
                    src="/images/basket-black.png"
                    width={24}
                    height={24}
                    alt="Корзина"
                  />
                  Корзина
                </Link>
                <Link href="/orders" className={styles.authElement}>
                  <Image
                    src="/images/cube-black.png"
                    width={24}
                    height={24}
                    alt="Заказы"
                  />
                  <span>Заказы</span>
                </Link>
                <div className={styles.authElement} onClick={logout}>
                  <Image
                    src="/images/logout-black.png"
                    width={24}
                    height={24}
                    alt="Выйти"
                  />
                  Выйти
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={styles.authElement}
                  onClick={closeNavbar}
                >
                  <Image
                    src="/images/login-black.png"
                    width={24}
                    height={24}
                    alt="Вход"
                  />
                  Вход
                </Link>
                <Link
                  href="/auth/registration"
                  className={styles.authElement}
                  onClick={closeNavbar}
                >
                  <Image
                    src="/images/registration.png"
                    width={24}
                    height={24}
                    alt="Регистрация"
                  />
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
