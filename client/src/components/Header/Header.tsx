import { getCategories } from "@/shared/api/categories";
import { CategoryDto } from "@/types/categories";
import { cookies } from "next/headers";
import Link from "next/link";
import AuthLinks from "./AuthLinks/AuthLinks";
import styles from "./Header.module.css";
import Navbar from "./Navbar/Navbar";
import NavbarToggler from "./NavbarToggler/NavbarToggler";
import Search from "./Search/Search";

export default async function Header() {
  const res = await getCategories();
  let categoriesList: CategoryDto[] = [];

  if (!res.ok) {
    console.error("Ошибка при получении категорий:", res.error);
  } else {
    categoriesList = res.data ?? [];
  }

  const cookieStore = await cookies();
  const isRefresh = cookieStore.has("refresh_token");

  return (
    <header>
      <div className={styles.topInfo}>KidsOutfit - Магазин детской одежды</div>
      <div className={styles.header}>
        <div className={styles.title}>
          <NavbarToggler />
          <Link href="/" className={styles.logo}>
            KidsOutfit
          </Link>
        </div>
        <div className={styles.categories}>
          <ul className={styles.categoriesList}>
            <li>
              <Link href="/catalog/section?type=new">Новинки</Link>
            </li>
            <li>
              <Link href="/catalog/section?type=popular">Хиты продаж</Link>
            </li>
            <li>
              <Link href="/catalog/section?type=sale">Распродажа</Link>
            </li>
          </ul>
        </div>
        <Search />
        <AuthLinks isRefresh={isRefresh} />
      </div>

      <Navbar categories={categoriesList} />
    </header>
  );
}
