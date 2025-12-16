import { OrderProductResponseDto } from "@/types/order";
import Image from "next/image";
import Link from "next/link";
import styles from "./OrderProduct.module.css";

interface OrderProductProps {
  orderProduct: OrderProductResponseDto;
}

export default function OrderProduct({ orderProduct }: OrderProductProps) {
  return (
    <div className={styles.product}>
      <div className={styles.flexPart}>
        <Link
          href={`/product/${orderProduct.productSize.product.slug}-${orderProduct.productSize.product.id}`}
          className={styles.image}
        >
          <Image
            src={
              orderProduct.productSize.product.image?.url ||
              "/content/default.jpg"
            }
            width={60}
            height={60}
            alt="Product"
          />
        </Link>
        <div>
          <Link
            href={`/product/${orderProduct.productSize.product.slug}-${orderProduct.productSize.product.id}`}
            className={styles.name}
          >
            {orderProduct.productSize.product.name} - {orderProduct.quantity}{" "}
            шт.
          </Link>
          <div className={styles.additionalInfo}>
            Размер: <span>{orderProduct.productSize.size.name}</span>
          </div>
          <div className={styles.additionalInfo}>
            Артикул: <span>{orderProduct.productSize.product.sku}</span>
          </div>
        </div>
      </div>

      <div className={styles.flexPart}>
        <div className={styles.price}>{orderProduct.price} Руб.</div>
      </div>
    </div>
  );
}
