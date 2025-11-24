"use client";

import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { logoutThunk } from "@/redux/thunks/logoutThunk";
import { CategoryDto } from "@/types/categories";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

    if (logoutThunk.fulfilled.match(result)) {
      router.push("/auth/login");
    } else {
      console.error("Ошибка выхода:", result.payload);
    }
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
                  Хиты продаж
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
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className={styles.authElement}
                    onClick={closeNavbar}
                  >
                    <Image
                      src="/images/admin.png"
                      width={24}
                      height={24}
                      alt="Админ"
                    />
                    Админ-панель
                  </Link>
                )}
                <Link
                  href="/cart/"
                  className={styles.authElement}
                  onClick={closeNavbar}
                >
                  <Image
                    src="/images/basket.png"
                    width={24}
                    height={24}
                    alt="Корзина"
                  />
                  Корзина
                </Link>
                <div className={styles.authElement} onClick={logout}>
                  <Image
                    src="/images/logout.png"
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
                    src="/images/login.png"
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
