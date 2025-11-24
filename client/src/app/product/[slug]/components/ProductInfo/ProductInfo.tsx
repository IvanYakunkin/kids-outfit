import { ProductCharacteristicDto } from "@/types/productCharacteristics";
import styles from "./ProductInfo.module.css";

interface ProductInfoProps {
  description?: string;
  care?: string;
  characteristics?: ProductCharacteristicDto[];
}

export default function ProductInfo({
  description,
  care,
  characteristics,
}: ProductInfoProps) {
  return (
    <div className={styles.productInfo}>
      <div className={styles.about}>
        {description && (
          <div className={styles.description}>
            <div className={styles.title}>О товаре</div>
            <p>{description}</p>
          </div>
        )}
        {care && (
          <div className={styles.description}>
            <div className={styles.title}>Особенности ухода</div>
            <p>{care}</p>
          </div>
        )}
      </div>
      {characteristics && (
        <div className={styles.characteristics}>
          {characteristics.map((char: ProductCharacteristicDto) => (
            <div className={styles.characteristic} key={char.id}>
              <div className={styles.characteristic__name}>
                {char.characteristic.value}
              </div>
              <div className={styles.characteristic__value}>{char.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
