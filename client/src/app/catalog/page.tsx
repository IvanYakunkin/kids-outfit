import { CollectionLazy } from "@/components/Collection/CollectionLazy";
import { ProductQueryParams } from "@/types/products";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import styles from "./catalog.module.css";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const paramsObject: ProductQueryParams = await searchParams;
  let title: string | undefined = "";
  switch (paramsObject.sort) {
    case "created_at":
      title = "Новинки";
      break;
    case "sold":
      title = "Хиты продаж";
      break;
    case "discount":
      title = "Распродажи";
      break;
    default:
      title = undefined;
  }

  const pathParts = [
    title ? { name: title, url: null } : { name: "Каталог", url: null },
  ];

  return (
    <main className={styles.main}>
      <Breadcrumbs pathParts={pathParts} />
      <div className={styles.title}>{title}</div>
      <CollectionLazy productQueryParams={paramsObject} />
    </main>
  );
}
