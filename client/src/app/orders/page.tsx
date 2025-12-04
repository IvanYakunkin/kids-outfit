"use client";

import { getUserOrders } from "@/shared/api/orders";
import { OrderResponseDto } from "@/types/order";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrderProduct from "./components/OrderProduct/OrderProduct";
import styles from "./page.module.css";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponseDto[]>();
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      const ordersResponse = await getUserOrders();
      if (!ordersResponse.ok) {
        console.log(ordersResponse.error);
        alert("Ошибка получения заказов");
      }

      if (ordersResponse.ok && ordersResponse.data) {
        setOrders(ordersResponse.data);
      }
    };

    getOrders();
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const formattedDate = new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

    return formattedDate;
  };

  return (
    <main className={styles.orders}>
      {!orders ? (
        <div style={{ textAlign: "center", marginTop: "40vh" }}>
          <CircularProgress size={60} />
        </div>
      ) : (
        <>
          <div className={styles.title}>Заказы ({orders.length})</div>
          <div className={styles.collection}>
            {orders.map((order) => (
              <div className={styles.order} key={order.id}>
                <div className={styles.order__date}>
                  Заказ от {formatDate(order.createdAt)} на {order.total} рублей
                </div>
                <div className={styles.order__status}>{order.status.name}</div>
                <div
                  className={styles.showProductsBtn}
                  onClick={() => setShowProducts(!showProducts)}
                >
                  Показать состав
                </div>

                {showProducts && (
                  <div className={styles.order__products}>
                    {order.products.map((orderProduct) => (
                      <OrderProduct
                        key={orderProduct.id}
                        orderProduct={orderProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
