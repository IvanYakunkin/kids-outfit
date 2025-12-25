"use client";

import OrderProduct from "@/app/orders/components/OrderProduct/OrderProduct";
import { formatDate } from "@/shared/formatDate";
import { OrderResponseDto } from "@/types/order";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import styles from "./OrdersViewer.module.css";

interface OrdersViewerProps {
  orders: OrderResponseDto[];
  hideTitle?: boolean;
}

export default function OrdersViewer({ orders, hideTitle }: OrdersViewerProps) {
  const [openedOrders, setOpenedOrders] = useState<number[]>([]);

  const handleShowOrderProducts = (orderId: number) => {
    if (openedOrders.includes(orderId)) {
      setOpenedOrders((prev) => prev.filter((idx) => idx !== orderId));
    } else {
      setOpenedOrders([...openedOrders, orderId]);
    }
  };

  return (
    <>
      {!orders ? (
        <div style={{ textAlign: "center", marginTop: "40vh" }}>
          <CircularProgress size={60} />
        </div>
      ) : (
        <>
          {hideTitle && (
            <div className={styles.title}>
              Заказы <span>({orders.length})</span>
            </div>
          )}
          <div className={styles.collection}>
            {orders.length === 0 && (
              <div
                className={styles.empty}
                style={{ fontSize: "1.1em", paddingTop: 30 }}
              >
                В данный момент у вас нет заказов
              </div>
            )}
            {orders.map((order) => (
              <div className={styles.order} key={order.id}>
                <div className={styles.date}>
                  Заказ от {formatDate(order.createdAt)} на {order.total} рублей
                </div>
                <div className={styles.address}>
                  Адрес доставки: <span>{order.address}</span>
                </div>
                <div className={styles.status}>
                  Статус заказа: <span>{order.status.name}</span>
                </div>

                {orders.length > 1 && (
                  <div
                    className={styles.showProductsBtn}
                    onClick={() => handleShowOrderProducts(order.id)}
                  >
                    {!openedOrders.includes(order.id) ? (
                      <span>Показать состав</span>
                    ) : (
                      <span>Скрыть состав</span>
                    )}
                  </div>
                )}

                {(orders.length === 1 || openedOrders.includes(order.id)) && (
                  <div className={styles.products}>
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
    </>
  );
}
