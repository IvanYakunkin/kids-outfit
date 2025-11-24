import { ProductSizesDto } from "@/types/productSizes";
import styles from "./SizeBox.module.css";

interface SizeBoxProps {
  productSizes: ProductSizesDto[];
  selectedSize: ProductSizesDto;
  setSelectedSize: (productSize: ProductSizesDto) => void;
}

export default function SizeBox({
  productSizes,
  selectedSize,
  setSelectedSize,
}: SizeBoxProps) {
  return (
    <div className={styles.sizeBox}>
      <div className={styles.label}>Выберите размер:</div>
      <div className={styles.sizes}>
        {productSizes.map((productSize) => (
          <div
            className={
              selectedSize.id == productSize.id
                ? styles.size + " " + styles.selected
                : styles.size
            }
            onClick={() => setSelectedSize(productSize)}
            key={productSize.id}
          >
            {productSize.size.name}
          </div>
        ))}
      </div>
    </div>
  );
}
