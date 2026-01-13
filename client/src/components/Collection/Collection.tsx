import { ProductResponseDto } from "@/types/products";
import styles from "./Collection.module.css";
import CollectionItem from "./CollectionItem";

interface CollectionProps {
  collection: ProductResponseDto[];
  isLoadingEager?: boolean;
  title?: string;
  titleStyles?: React.CSSProperties;
}

export default function Collection(props: CollectionProps) {
  return (
    <div className={styles.collection}>
      {props.title && (
        <div className="mainTitle" style={props.titleStyles}>
          {props.title}
        </div>
      )}
      {props.collection.length === 0 && (
        <div className="center">Товары отсутствуют</div>
      )}
      <div className={styles.items}>
        {props.collection.map((product, index) => (
          <CollectionItem
            key={`${product.id}-${index}`}
            item={product}
            isLoadingEager={props.isLoadingEager}
          />
        ))}
      </div>
    </div>
  );
}
