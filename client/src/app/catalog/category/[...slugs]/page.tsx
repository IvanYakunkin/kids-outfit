import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import { CollectionLazy } from "@/components/Collection/CollectionLazy";
import {
  getCategoryBySlugs,
  getCategoryHierarchy,
} from "@/shared/api/categories";
import { IPathParts } from "@/types/common/common";
import { ProductQueryParams } from "@/types/products";
import { notFound } from "next/navigation";
import styles from "../../catalog.module.css";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slugs: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slugs } = await params;
  const sParams: ProductQueryParams = await searchParams;

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
  sParams.category = category.id;
  const key = JSON.stringify({ sParams });

  return (
    <main className={styles.main}>
      <Breadcrumbs pathParts={pathParts} />
      <div className={styles.title}>{category.name}</div>
      <CollectionLazy key={key} productQueryParams={sParams} />
    </main>
  );
}
