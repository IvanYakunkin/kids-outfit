import OrdersViewer from "@/components/OrdersViewer/OrdersViewer";
import { getOrderById } from "@/shared/api/orders";
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

  const order = await getOrderById(id, cookieHeader);
  if (!order.ok || !order.data) {
    return "Заказ не найден";
  }

  return (
    <main className={styles.viewOrder}>
      <OrdersViewer orders={order.data} />
    </main>
  );
}
