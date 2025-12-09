import { getProductById } from "@/shared/api/products";
import ProductForm from "../../components/ProductForm/ProductForm";

export default async function EditProductPage({
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
      mode="edit"
      initialProduct={product.data}
      titleLabel="Редактирование товара"
    />
  );
}
