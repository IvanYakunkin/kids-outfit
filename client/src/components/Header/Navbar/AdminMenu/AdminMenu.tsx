import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./AdminMenu.module.css";

interface AdminMenuProps {
  closeNavbar: () => void;
}

export default function AdminMenu({ closeNavbar }: AdminMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div
        className={styles.authElement}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={styles.adminToggler}>
          <div className={styles.adminLabel}>
            <Image
              src="/images/settings-black.png"
              className={`${styles.rotator} ${isMenuOpen && styles.rotate}`}
              width={24}
              height={24}
              alt="Админ"
            />
            <span>Админ-панель</span>
          </div>
          <span
            className={`${styles.toggleIcon} ${
              isMenuOpen ? styles.reverse : ""
            }`}
          ></span>
        </div>
      </div>
      <div className={`${styles.adminMenu} ${isMenuOpen && styles.show}`}>
        <Link
          href="/admin/products"
          className={`${styles.authElement} ${styles.secondary}`}
          onClick={closeNavbar}
        >
          Товары
        </Link>
        <Link
          href="/admin/orders"
          className={`${styles.authElement} ${styles.secondary}`}
          onClick={closeNavbar}
        >
          Заказы
        </Link>
        <Link
          href="/admin/users"
          className={`${styles.authElement} ${styles.secondary}`}
          onClick={closeNavbar}
        >
          Пользователи
        </Link>
        <Link
          href="/admin/categories"
          className={`${styles.authElement} ${styles.secondary}`}
          onClick={closeNavbar}
        >
          Категории
        </Link>
        <Link
          href="/admin/characteristics"
          className={`${styles.authElement} ${styles.secondary}`}
          onClick={closeNavbar}
        >
          Характеристики
        </Link>
        <Link
          href="/admin/sizes"
          className={`${styles.authElement} ${styles.secondary}`}
          onClick={closeNavbar}
        >
          Размеры
        </Link>
        <Link
          href="/admin/statuses"
          className={`${styles.authElement} ${styles.secondary}`}
          onClick={closeNavbar}
        >
          Статусы
        </Link>
      </div>
    </>
  );
}
