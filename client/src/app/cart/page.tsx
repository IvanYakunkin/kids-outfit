"use client";

import { getCart, updateQuantityInCart } from "@/shared/api/cart";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import { getCartSummary } from "@/shared/getCartSummary";
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

  useEffect(() => {
    const getCartData = async () => {
      const cartResponse = await getCart();

      setIsCartLoading(false);
      if (cartResponse.ok && cartResponse.data) {
        setCartProducts(cartResponse.data);
      }
    };

    getCartData();
  }, [router]);

  const { totalQuantity, totalPrice, totalDiscount } =
    getCartSummary(cartProducts);

  const changeQuantity = (e: number, cartProduct: CartDto) => {
    setCartProducts((prevItems) =>
      prevItems.map((item) =>
        item.id === cartProduct.id ? { ...item, quantity: e } : item
      )
    );
  };

  const toCheckout = async () => {
    updateAllCartProducts();
    router.push("/checkout");
  };

  async function updateProductQuantity(cartProduct: CartDto) {
    return await authRequestWrapper(
      () =>
        updateQuantityInCart(cartProduct.productSize.id, cartProduct.quantity),
      router
    );
  }

  async function updateAllCartProducts() {
    const updatePromises = cartProducts.map((product) =>
      updateProductQuantity(product)
    );
    try {
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Ошибка при обновлении корзины:", error);
    }
  }

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
