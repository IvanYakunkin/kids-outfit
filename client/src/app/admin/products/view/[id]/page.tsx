import ProductForm from "@/app/admin/products/components/ProductForm/ProductForm";
import { getProductById } from "@/shared/api/products";

export default async function ProductViewPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const product = await getProductById(id);
  if (!product.ok || !product.data) {
    console.log("Не удалось получить товар", product.error);
  }

  return (
    <ProductForm
      mode="view"
      initialProduct={product.data}
      titleLabel="Просмотр товара"
    />
  );
}
