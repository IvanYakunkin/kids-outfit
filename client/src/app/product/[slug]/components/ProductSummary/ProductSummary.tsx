"use client";
import { ProductSizesDto } from "@/types/productSizes";
import Image from "next/image";
import { useState } from "react";
import SizeBox from "../SizeBox/SizeBox";
import CartButton from "./CartButton";
import styles from "./ProductSummary.module.css";

interface ProductSummaryProps {
  productName: string;
  productPrice: number;
  productDiscount?: number;
  productSizes?: ProductSizesDto[];
}

export default function ProductSummary({
  productName,
  productPrice,
  productDiscount,
  productSizes,
}: ProductSummaryProps) {
  const [selectedSize, setSelectedSize] = useState(
    productSizes ? productSizes[0] : null
  );

  return (
    <div className={styles.summary}>
      <div className={styles.description}>
        <div className={styles.productName}>{productName}</div>
        <div className={styles.finalCost}>
          <div className={styles.currentCost}>
            {productDiscount ? (
              <span>
                {Math.round(
                  productPrice - (productPrice / 100) * productDiscount
                )}{" "}
                Руб.
              </span>
            ) : (
              <span>{productPrice} Руб.</span>
            )}
          </div>
          {productDiscount && (
            <div className={styles.oldCost}> {productPrice} Руб.</div>
          )}
        </div>
        {!productSizes || productSizes.length == 0 || !selectedSize ? (
          <div style={{ marginTop: "10px" }}>
            В настоящий момент данный товар закончился
          </div>
        ) : (
          <SizeBox
            productSizes={productSizes}
            setSelectedSize={(productSize: ProductSizesDto) =>
              setSelectedSize(productSize)
            }
            selectedSize={selectedSize}
          />
        )}
        <div className={styles.productProperty}>
          <Image
            src="/images/boxes.png"
            width={26}
            height={26}
            alt="Quantity"
          />
          <div>
            В наличии:{" "}
            <span>
              {selectedSize && selectedSize.quantity
                ? selectedSize.quantity
                : "Товар закончился"}
            </span>
          </div>
        </div>
        <div className={styles.additional}>
          <div className={styles.productProperty}>
            <Image
              src="/images/certificate.png"
              width={26}
              height={26}
              alt="Quantity"
            />
            <div>Сертифицировано</div>
          </div>
          <div className={styles.productProperty}>
            <Image
              src="/images/barcode.png"
              width={26}
              height={26}
              alt="Quantity"
            />
            <div>Честный знак</div>
          </div>
        </div>

        <CartButton selectedSize={selectedSize} />
      </div>
    </div>
  );
}
