import OrdersViewer from "@/components/OrdersViewer/OrdersViewer";
import { getUserOrders } from "@/shared/api/orders";
import { cookies } from "next/headers";
import styles from "./page.module.css";

export default async function Orders() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const ordersResponse = await getUserOrders(cookieHeader);

  if (!ordersResponse.ok || !ordersResponse.data) {
    ordersResponse.data = [];
  }

  return (
    <main className={styles.orders}>
      <OrdersViewer orders={ordersResponse.data} hideTitle={true} />
    </main>
  );
}
