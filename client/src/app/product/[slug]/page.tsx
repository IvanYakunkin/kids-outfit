import Collection from "@/components/Collection/Collection";
import { getProductById, getSimilarProducts } from "@/shared/api/products";
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

  const product = productRes.data;

  const similarProductsRes = await getSimilarProducts(product.category.id, 5);
  let similarProducts: ProductResponseDto[] = [];

  if (!similarProductsRes.ok) {
    console.error(
      `Не удалось загрузить похожие товары для категории ${product.category.id}`,
      similarProductsRes.error
    );
  } else {
    similarProducts = similarProductsRes.data ?? [];
  }

  return (
    <main className={styles.product}>
      {/* <nav className={styles.breadcrumbs}>
        <Breadcrumbs categoryId={product.category.id} />
      </nav> */}
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
      <Collection
        collection={similarProducts}
        title="Похожие товары"
      ></Collection>
    </main>
  );
}
