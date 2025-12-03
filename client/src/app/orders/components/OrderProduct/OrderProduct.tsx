import { OrderProductResponseDto } from "@/types/order";
import Image from "next/image";
import Link from "next/link";
import styles from "./OrderProduct.module.css";

interface OrderProductProps {
  orderProduct: OrderProductResponseDto;
}

export default function OrderProduct({ orderProduct }: OrderProductProps) {
  return (
    <div className={styles.product} key={orderProduct.productSize.id}>
      <div className={styles.flexPart}>
        <Link
          href={`/product/${orderProduct.productSize.product.slug}-${orderProduct.productSize.product.id}`}
          className={styles.product__image}
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
        <div className={styles.product__description}>
          <Link
            href={`/product/${orderProduct.productSize.product.slug}-${orderProduct.productSize.product.id}`}
            className={styles.product__name}
          >
            {orderProduct.productSize.product.name}
          </Link>
          <div className={styles.product__additionalInfo}>
            Размер: <span>{orderProduct.productSize.size.name}</span>
          </div>
          <div className={styles.product__additionalInfo}>
            Артикул: <span>{orderProduct.productSize.product.sku}</span>
          </div>
        </div>
      </div>
      <div className={styles.flexPart}>
        <div className={styles.product__quantity}>
          <label>Кол-во</label>
          <input type="number" readOnly value={orderProduct.quantity} />
        </div>
      </div>
    </div>
  );
}
