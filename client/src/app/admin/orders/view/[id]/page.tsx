import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import OrdersViewer from "@/components/OrdersViewer/OrdersViewer";
import { getOrderById } from "@/shared/api/orders";
import { OrderResponseDto } from "@/types/order";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export default async function ViewOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);

  if (!id || isNaN(id)) {
    return notFound();
  }
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const orderRes = await getOrderById(id, cookieHeader);
  if (!orderRes.ok || !orderRes.data) {
    return "Заказ не найден";
  }

  const order = orderRes.data as OrderResponseDto;

  const pathParts = [
    {
      name: "Админ-панель",
      url: "/admin/",
    },
    {
      name: "Заказы",
      url: "/admin/orders",
    },
    {
      name: `Заказ №${order.id}`,
      url: null,
    },
  ];

  return (
    <main className={styles.viewOrder}>
      <Breadcrumbs pathParts={pathParts} />
      <OrdersViewer orders={order} />
    </main>
  );
}
