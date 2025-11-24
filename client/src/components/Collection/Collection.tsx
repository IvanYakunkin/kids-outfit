import { ProductResponseDto } from "@/types/products";
import styles from "./Collection.module.css";
import CollectionItem from "./CollectionItem";

interface CollectionProps {
  collection: ProductResponseDto[];
  title?: string;
}

export default function Collection(props: CollectionProps) {
  return (
    <div className={styles.collection}>
      <div className="mainTitle">{props.title && props.title}</div>
      {props.collection.length === 0 && (
        <div className="center">Товары отсутствуют</div>
      )}
      <div className={styles.items}>
        {props.collection.map((product, index) => (
          <CollectionItem key={`${product.id}-${index}`} item={product} />
        ))}
      </div>
    </div>
  );
}
