import { ProductImageDto } from "@/types/products";
import ProductSwiper from "../ProductSwiper/ProductSwiper";
import styles from "./ProductItem.module.css";

interface ProductItemProps {
  images?: ProductImageDto[];
  discount?: number;
}

export default function ProductItem({ images, discount }: ProductItemProps) {
  return (
    <div className={styles.itemSliders}>
      <div className={styles.swiper}>
        <ProductSwiper images={images} />
      </div>
      {!!discount && discount > 0 && (
        <div className={styles.additional}>
          <div className={`${styles.additional__block} ${styles.status}`}>
            Новинка
          </div>
          <div className={`${styles.additional__block} ${styles.discount}`}>
            - {Math.round(discount)} %
          </div>
        </div>
      )}
    </div>
  );
}
