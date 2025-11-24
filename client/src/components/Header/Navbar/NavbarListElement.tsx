import { CategoryDto } from "@/types/categories";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useNavbarContext } from "./NavbarContext";

interface NavbarListElementProps {
  openMenuIds: number[];
  category: CategoryDto;
  setOpenMenuIds: React.Dispatch<React.SetStateAction<number[]>>;
  previousCategories?: string[];
}

const NavbarListElement = ({
  openMenuIds,
  category,
  setOpenMenuIds,
  previousCategories,
}: NavbarListElementProps) => {
  const { closeNavbar } = useNavbarContext();

  const openMenu = (id: number) => {
    if (openMenuIds.includes(id)) {
      setOpenMenuIds((prevNumbers) => prevNumbers.filter((num) => num !== id));
    } else {
      setOpenMenuIds([...openMenuIds, id]);
    }
  };

  const categoriesParts = previousCategories
    ? [...previousCategories, category.slug]
    : [category.slug];

  return (
    <li>
      <div className={styles.title}>
        <Link
          href={`/catalog/category/${categoriesParts?.join("/")}`}
          onClick={closeNavbar}
        >
          {category.name}
        </Link>
        {category.children.length > 0 && (
          <span
            className={`${styles.toggleIcon} ${
              openMenuIds.includes(category.id) ? styles.reverse : ""
            }`}
            onClick={() => openMenu(category.id)}
          ></span>
        )}
      </div>
      {category.children.length > 0 && (
        <ul
          className={`${styles.list} ${styles.second} ${
            openMenuIds.includes(category.id) ? styles.show : ""
          }`}
        >
          {category.children.map((childCategory) => (
            <NavbarListElement
              key={childCategory.id}
              category={childCategory}
              openMenuIds={openMenuIds}
              setOpenMenuIds={setOpenMenuIds}
              previousCategories={categoriesParts}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavbarListElement;
