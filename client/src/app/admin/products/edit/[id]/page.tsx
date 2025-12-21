import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import { getProductById } from "@/shared/api/products";
import { ProductResponseDto } from "@/types/products";
import ProductForm from "../../components/ProductForm/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const productRes = await getProductById(id);
  if (!productRes.ok || !productRes.data) {
    console.log("Не удалось получить товар", productRes.error);
  }

  const product = productRes.data as ProductResponseDto;

  const pathParts = [
    { name: "Админ-панель", url: "/admin/" },
    { name: "Товары", url: "/admin/products" },
    { name: product.name, url: `/admin/products/view/${product.id}` },
    { name: "Редактирование" },
  ];

  return (
    <>
      <Breadcrumbs
        pathParts={pathParts}
        additionalStyles={{ width: "1400px", margin: "20px auto" }}
      />
      <ProductForm
        mode="edit"
        initialProduct={product}
        titleLabel="Редактирование товара"
      />
    </>
  );
}
