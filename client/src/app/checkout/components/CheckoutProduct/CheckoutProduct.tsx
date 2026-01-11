import { getDiscountedPrice } from "@/shared/getDiscountedPrice";
import { CartDto } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";
import styles from "./CheckoutProduct.module.css";

interface CheckoutProductProps {
  cartProduct: CartDto;
}

export default function CheckoutProduct({ cartProduct }: CheckoutProductProps) {
  const product = cartProduct.productSize.product;
  return (
    <div className={styles.product} key={cartProduct.id}>
      <div className={styles.flexPart}>
        <Link
          href={`/product/${product.slug}-${product.id}`}
          className={styles.image}
        >
          <Image
            src={product.image?.url || "/content/default.jpg"}
            width={90}
            height={120}
            alt="Product"
          />
        </Link>
        <div className={styles.description}>
          <Link
            href={`/product/${product.slug}-${product.id}`}
            className={styles.name}
          >
            {product.name}
          </Link>
          <div className={styles.additionalInfo}>
            Размер: <span>{cartProduct.productSize.size.name}</span>
          </div>
          <div className={styles.additionalInfo}>
            Артикул: <span>{cartProduct.productSize.product.sku}</span>
          </div>
          <div className={styles.additionalInfo}>
            Количество: <span>{cartProduct.quantity} шт.</span>
          </div>
        </div>
      </div>
      <div className={styles.flexPart}>
        <div className={styles.priceBlock}>
          <div className={styles.price}>
            {getDiscountedPrice(product.price, product.discount)} Руб.
          </div>
          <div className={styles.priceOld}>
            <span>{product.price} Руб.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
