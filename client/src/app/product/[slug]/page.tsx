import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import Collection from "@/components/Collection/Collection";
import { getCategoryHierarchy } from "@/shared/api/categories";
import { getProductById, getSimilarProducts } from "@/shared/api/products";
import { IPathParts } from "@/types/common/common";
import { ProductResponseDto } from "@/types/products";
import { notFound } from "next/navigation";
import ProductInfo from "./components/ProductInfo/ProductInfo";
import ProductItem from "./components/ProductItem/ProductItem";
import ProductSummary from "./components/ProductSummary/ProductSummary";
import styles from "./page.module.css";

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Find the product by id
  const { slug } = await params;
  const idParam: string | undefined = slug.split("-").at(-1);

  if (!idParam) {
    return notFound();
  }

  const id: number = Number(idParam);
  const isNumber: boolean = !isNaN(id) && Number.isInteger(id);

  if (!isNumber) {
    return notFound();
  }

  const productRes = await getProductById(id);
  if (!productRes.ok || !productRes.data) {
    return notFound();
  }

  // Find similar products
  const product = productRes.data;

  const similarProductsRes = await getSimilarProducts(product.category.id, 15);
  let similarProducts: ProductResponseDto[] = [];

  if (!similarProductsRes.ok) {
    console.error(
      `Не удалось загрузить похожие товары для категории ${product.category.id}`,
      similarProductsRes.error
    );
  } else {
    similarProducts = similarProductsRes.data ?? [];
  }

  // Get product's category with parent categories
  const pathParts: IPathParts[] = [];
  const categoriesRes = await getCategoryHierarchy(product.category.id);
  if (categoriesRes.ok && categoriesRes.data) {
    let urlPath = "catalog/category/";
    categoriesRes.data.forEach((category) => {
      urlPath += `${category.slug}/`;
      pathParts.push({
        name: category.name,
        url: `/${urlPath}`,
      });
    });
  }
  pathParts.push({
    name: product.name,
    url: null,
  });

  return (
    <main className={styles.product}>
      <Breadcrumbs pathParts={pathParts} />
      <div className={styles.productContent}>
        <ProductItem images={product.images} discount={product.discount} />
        <ProductSummary
          productName={product.name}
          productPrice={product.price}
          productDiscount={product.discount}
          productSizes={product.sizes}
        />
      </div>
      <ProductInfo
        care={product.care}
        description={product.description}
        characteristics={product.productCharacteristics}
      />
      <div style={{ padding: "0 5px" }}>
        <Collection collection={similarProducts} title="Похожие товары" />
      </div>
    </main>
  );
}
