import Collection from "@/components/Collection/Collection";
import { getCategoryBySlugs } from "@/shared/api/categories";
import { getProductsByCategory } from "@/shared/api/products";
import { notFound } from "next/navigation";
import styles from "../../catalog.module.css";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slugs: string[] }>;
}) {
  const { slugs } = await params;

  if (!slugs) {
    return notFound();
  }

  const categoryRes = await getCategoryBySlugs(slugs);
  if (!categoryRes.ok || !categoryRes.data) {
    return notFound();
  }
  const category = categoryRes.data;

  const productsRes = await getProductsByCategory(category.id);
  if (!productsRes.ok || !productsRes.data) {
    return notFound();
  }
  const products = productsRes.data;

  return (
    <main className={styles.main}>
      <Collection title={category.name} collection={products.data} />
    </main>
  );
}
