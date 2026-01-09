import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import Collection from "@/components/Collection/Collection";
import {
  getCategoryBySlugs,
  getCategoryHierarchy,
} from "@/shared/api/categories";
import { getProductsByCategory } from "@/shared/api/products";
import { IPathParts } from "@/types/common/common";
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

  const categoriesHierarchyRes = await getCategoryHierarchy(category.id);
  if (!categoriesHierarchyRes.ok || !categoriesHierarchyRes.data) {
    return notFound();
  }

  const productsRes = await getProductsByCategory(category.id);
  if (!productsRes.ok || !productsRes.data) {
    return notFound();
  }
  const products = productsRes.data;

  const pathParts: IPathParts[] = [];
  if (categoriesHierarchyRes.ok && categoriesHierarchyRes.data) {
    let urlPath = "catalog/category/";
    categoriesHierarchyRes.data.forEach((category, idx) => {
      if (idx === categoriesHierarchyRes.data!.length - 1) return;
      urlPath += `${category.slug}/`;
      pathParts.push({
        name: category.name,
        url: `/${urlPath}`,
      });
    });
  }
  pathParts.push({
    name: category.name,
    url: null,
  });

  return (
    <main className={styles.main}>
      <Breadcrumbs pathParts={pathParts} />
      <Collection
        title={category.name}
        collection={products.data}
        titleStyles={{ paddingTop: 0 }}
      />
    </main>
  );
}
