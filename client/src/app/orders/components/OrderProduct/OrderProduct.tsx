import { OrderProductResponseDto } from "@/types/order";
import Image from "next/image";
import styles from "./OrderProduct.module.css";

interface OrderProductProps {
  orderProduct: OrderProductResponseDto;
}

export default function OrderProduct({ orderProduct }: OrderProductProps) {
  return (
    <div className={styles.product} key={orderProduct.productSize.id}>
      <div className={styles.flexPart}>
        <a
          href={"/product/" + orderProduct.id}
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
        </a>
        <div className={styles.product__description}>
          <a
            href={"/product/" + orderProduct.id}
            className={styles.product__name}
          >
            {orderProduct.productSize.product.name}
          </a>
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
