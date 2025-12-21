"use client";

import ProductForm from "@/app/admin/products/components/ProductForm/ProductForm";
import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";

export default function CreateProductPage() {
  const pathParts = [
    { name: "Админ-панель", url: "/admin/" },
    { name: "Товары", url: "/admin/products" },
    { name: "Создать" },
  ];
  return (
    <>
      <Breadcrumbs
        pathParts={pathParts}
        additionalStyles={{ width: "1400px", margin: "20px auto" }}
      />
      <ProductForm mode="create" titleLabel="Создание товара" />
    </>
  );
}
