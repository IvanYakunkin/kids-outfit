import ProductForm from "@/app/admin/products/components/ProductForm/ProductForm";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import { getProductById } from "@/shared/api/products";
import { ProductResponseDto } from "@/types/products";

export default async function ProductViewPage({
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
    {
      name: "Админ-панель",
      url: "/admin/",
    },
    {
      name: "Товары",
      url: "/admin/products",
    },
    {
      name: product.name,
    },
  ];

  return (
    <>
      <Breadcrumbs
        pathParts={pathParts}
        additionalStyles={{ width: "1400px", margin: "20px auto" }}
      />
      <ProductForm
        mode="view"
        initialProduct={product}
        titleLabel="Просмотр товара"
      />
    </>
  );
}
