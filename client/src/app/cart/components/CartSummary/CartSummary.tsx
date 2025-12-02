import styles from "./CartSummary.module.css";

interface CartSummaryProps {
  totalQuantity: number;
  totalPrice: number;
  totalDiscount: number;
}

export default function CartSummary({
  totalQuantity,
  totalPrice,
  totalDiscount,
}: CartSummaryProps) {
  const resultPrice = totalPrice - totalDiscount;

  return (
    <aside className={styles.summary}>
      <div className={styles.params}>
        <div className={styles.param}>
          <span>Количество</span>
          <span>{totalQuantity} шт.</span>
        </div>
        <div className={styles.param}>
          <span>Стоимость</span>
          <span>{totalPrice} Руб.</span>
        </div>
        <div className={styles.param}>
          <span>Скидка</span>
          <span className={styles.red}>{totalDiscount} Руб.</span>
        </div>
      </div>
      <div className={styles.price}>
        <span>Итого</span>
        <span>{resultPrice} Руб.</span>
      </div>
    </aside>
  );
}
