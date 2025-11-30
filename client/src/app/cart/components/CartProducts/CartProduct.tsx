import NumberSpinner from "@/components/UI/NumberSpinner/NumberSpinner";
import { removeProductFromCart } from "@/shared/api/cart";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import { getDiscountedPrice } from "@/shared/getDiscountedPrice";
import { CartDto } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import styles from "./CartProduct.module.css";

interface CartProductProps {
  cartProduct: CartDto;
  changeQuantity: (e: number, cartProduct: CartDto) => void;
  setCartProducts: Dispatch<SetStateAction<CartDto[]>>;
}

export default function CartProduct({
  cartProduct,
  changeQuantity,
  setCartProducts,
}: CartProductProps) {
  const product = cartProduct.productSize.product;
  const router = useRouter();

  const deleteBtnClick = async (productSizeId: number) => {
    const removeProductRes = await authRequestWrapper(
      () => removeProductFromCart(productSizeId),
      router
    );
    if (removeProductRes.ok && removeProductRes.data) {
      setCartProducts((prev) =>
        prev.filter((cProduct) => cProduct.productSize.id !== productSizeId)
      );
    }
  };

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
            height={90}
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
        <div className={styles.quantity}>
          <NumberSpinner
            onValueChange={(e) => changeQuantity(e || 1, cartProduct)}
            value={cartProduct.quantity}
            min={1}
            max={cartProduct.productSize.quantity}
            size="small"
          />
        </div>
        <div
          className={styles.delete}
          onClick={() => deleteBtnClick(cartProduct.productSize.id)}
        >
          <Image src="/images/delete.png" width={28} height={28} alt="delete" />
        </div>
      </div>
    </div>
  );
}
