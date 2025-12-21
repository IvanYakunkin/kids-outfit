import Collection from "@/components/Collection/Collection";
import { getProducts } from "@/shared/api/products";
import { PaginatedProductsDto, ProductQueryParams } from "@/types/products";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import styles from "./catalog.module.css";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const paramsObject: ProductQueryParams = await searchParams;
  //const searchParamsString = new URLSearchParams(paramsObject).toString();
  const productsRes = await getProducts<PaginatedProductsDto>(paramsObject);
  if (!productsRes.ok || !productsRes.data) {
    console.log(productsRes.error);
    return;
  }
  const products = productsRes.data.data;

  const pathParts = [{ name: "Каталог", url: null }];

  return (
    <main className={styles.main}>
      <Breadcrumbs pathParts={pathParts} />
      <div className={styles.title}>Каталог</div>
      <Collection collection={products} />
    </main>
  );
}
