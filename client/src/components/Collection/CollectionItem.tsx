import { ProductResponseDto } from "@/types/products";
import Image from "next/image";
import Link from "next/link";
import styles from "./Collection.module.css";

interface CollectionItemProps {
  item: ProductResponseDto;
}

const CollectionItem = ({ item }: CollectionItemProps) => {
  return (
    <article className={styles.item}>
      <Link href={`/product/${item.slug}-${item.id}`}>
        <div className={styles.imageContainer}>
          {item.image ? (
            <Image
              className={styles.image}
              width={300}
              height={300}
              src={item.image.url}
              alt="Product Photo"
            />
          ) : (
            <Image
              className={styles.image}
              width={300}
              height={400}
              src="/images/content/default.jpg"
              alt="Product Photo"
            />
          )}
        </div>
        <div className={styles.info}>
          <div className={styles.labels}>
            <div className={styles.labelNew}>Новинка</div>
            <div className={styles.labelDiscount}>
              {item.discount ? `${item.discount}%` : ""}
            </div>
          </div>
          <div className={styles.name}>{item.name}</div>
          <div className={styles.cost}>
            {item.discount && (
              <div className={styles.costCurrent}>
                <span>{item.price - (item.price / 100) * item.discount}</span>
                <div className={styles.currency}>
                  <span className="desktop">руб.</span>
                  <span className="mobile">₽</span>
                </div>
              </div>
            )}
            <div className={styles.costFull}>
              <span>{item.price}</span>
              <div className={styles.currency}>
                <span className="desktop">руб.</span>
                <span className="mobile">₽</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default CollectionItem;
