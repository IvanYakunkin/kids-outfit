"use client";

import { getCart } from "@/shared/api/cart";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import { getDiscountedPrice } from "@/shared/getDiscountedPrice";
import { CartDto } from "@/types/cart";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartProducts from "./components/CartProducts/CartProduct";
import CartSummary from "./components/CartSummary/CartSummary";
import styles from "./page.module.css";

export default function Cart() {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<CartDto[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  let totalQuantity = 0;
  let totalPrice = 0;
  let totalDiscount = 0;

  for (const cProduct of cartProducts) {
    const product = cProduct.productSize.product;

    totalQuantity += cProduct.quantity;
    totalPrice += product.price * cProduct.quantity;

    totalDiscount +=
      product.price * cProduct.quantity -
      getDiscountedPrice(product.price, product.discount) * cProduct.quantity;
  }

  totalPrice = Math.round(totalPrice);
  totalDiscount = Math.round(totalDiscount);

  useEffect(() => {
    const getCartData = async () => {
      const cartResponse = await authRequestWrapper(() => getCart(), router);
      setIsCartLoading(false);
      if (cartResponse.ok && cartResponse.data) {
        setCartProducts(cartResponse.data);
      }
    };

    getCartData();
  }, [router]);

  const changeQuantity = (e: number, cartProduct: CartDto) => {
    setCartProducts((prevItems) =>
      prevItems.map((item) =>
        item.id === cartProduct.id ? { ...item, quantity: e } : item
      )
    );
  };

  const toCheckout = async () => {
    // TODO: Update quantity in cartProduct
    router.push("/checkout");
  };
  return (
    <main className={styles.cart}>
      {isCartLoading ? (
        <div style={{ textAlign: "center", marginTop: "40vh" }}>
          <CircularProgress size={60} />
        </div>
      ) : (
        <>
          <div className={styles.title}>
            Моя корзина ({cartProducts.length})
          </div>
          <div className={styles.content}>
            {cartProducts.length == 0 && (
              <div className={styles.empty}>
                В данный момент товары отсутствуют в корзине{" "}
              </div>
            )}
            <div className={styles.products}>
              {cartProducts.map((cartProduct) => (
                <CartProducts
                  key={cartProduct.id}
                  cartProduct={cartProduct}
                  changeQuantity={changeQuantity}
                  setCartProducts={setCartProducts}
                />
              ))}
            </div>

            {cartProducts.length > 0 && (
              <div className={styles.rightSidebar}>
                <CartSummary
                  totalDiscount={totalDiscount}
                  totalPrice={totalPrice}
                  totalQuantity={totalQuantity}
                />

                <div className={styles.buttonContainer}>
                  <Button
                    onClick={toCheckout}
                    variant="contained"
                    sx={{
                      background: "var(--templatePurple)",
                      "&:hover": {
                        backgroundColor: "var(--templatePurpleHover)",
                      },
                    }}
                    fullWidth
                  >
                    Оформить
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
