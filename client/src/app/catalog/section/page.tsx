import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import Collection from "@/components/Collection/Collection";
import { getProducts } from "@/shared/api/products";
import { PaginatedProductsDto, ProductQueryParams } from "@/types/products";
import { notFound } from "next/navigation";
import styles from "../catalog.module.css";

export default async function SectionPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string }>;
}) {
  const { type } = await searchParams;
  if (!type) {
    return notFound();
  }

  let params: ProductQueryParams = {};
  let title = "";

  switch (type) {
    case "new":
      params = { sort: "created_at", order: "DESC" };
      title = "Новинки";
      break;
    case "popular":
      params = { sort: "sold", order: "DESC" };
      title = "Хиты";
      break;
    case "sale":
      params = { sort: "discount", order: "DESC" };
      title = "Распродажа";
      break;
  }

  if (!params) {
    return notFound();
  }

  const productsRes = await getProducts<PaginatedProductsDto>(params);
  if (!productsRes.ok || productsRes.data === undefined) {
    return notFound();
  }

  const products: PaginatedProductsDto = productsRes.data;

  const pathParts = [
    {
      name: title,
      url: null,
    },
  ];

  return (
    <main className={styles.main}>
      <Breadcrumbs pathParts={pathParts} />
      <Collection
        title={title}
        collection={products.data}
        titleStyles={{ paddingTop: 0 }}
      />
    </main>
  );
}
