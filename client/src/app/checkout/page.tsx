"use client";

import { RootState } from "@/redux/store";
import { getCart } from "@/shared/api/cart";
import { addOrder } from "@/shared/api/orders";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import { getAddressFromArray } from "@/shared/getAddressFromArray";
import { getCartSummary } from "@/shared/getCartSummary";
import { CartDto } from "@/types/cart";
import { IAddress } from "@/types/common/common";
import { OrderProductsDto } from "@/types/order";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CartSummary from "../cart/components/CartSummary/CartSummary";
import AddressBox from "./components/AddressBox/AddressBox";
import CheckoutProduct from "./components/CheckoutProduct/CheckoutProduct";
import styles from "./page.module.css";

export default function Checkout() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [cartProducts, setCartProducts] = useState<CartDto[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [address, setAddress] = useState<IAddress>({
    postalcode: "",
    region: "",
    city: "",
    street: "",
    house: "",
    apartment: "",
  });

  const { totalQuantity, totalPrice, totalDiscount } =
    getCartSummary(cartProducts);

  const createOrderBtn = async () => {
    const addressString = getAddressFromArray(address);
    const orderProducts: OrderProductsDto[] = cartProducts.map(
      (cartProduct) => ({
        productId: cartProduct.productSize.product.id,
        productSizeId: cartProduct.productSize.id,
        quantity: cartProduct.quantity,
      })
    );

    if (user && user.id) {
      const addOrderRes = await authRequestWrapper(
        () => addOrder(addressString, orderProducts),
        router
      );
      if (addOrderRes.ok) {
        if (addOrderRes.status === 201) {
          router.push("/orders");
        }
      } else {
        console.log("Не удалось создать заказ", addOrderRes.error);
        if (addOrderRes.status === 403) {
          alert("Достигнут лимит активных заказов");
        }
      }
    }
  };

  useEffect(() => {
    const getCartData = async () => {
      const cartResponse = await authRequestWrapper(() => getCart(), router);
      setIsCartLoading(false);
      if (
        cartResponse.ok &&
        cartResponse.data &&
        cartResponse.data.length > 0
      ) {
        setCartProducts(cartResponse.data);
      } else {
        router.push("/404");
      }
    };

    getCartData();
  }, [router]);

  return (
    <main className={styles.checkout}>
      {isCartLoading ? (
        <div style={{ textAlign: "center", marginTop: "40vh" }}>
          <CircularProgress size={60} />
        </div>
      ) : (
        <>
          <div className={styles.title}>Подтверждение заказа</div>
          <div className={styles.content}>
            <div className={styles.formContainer}>
              <AddressBox address={address} setAddress={setAddress} />
            </div>

            {cartProducts.length > 0 && (
              <div className={styles.rightSidebar}>
                {cartProducts.map((cartProduct) => (
                  <CheckoutProduct
                    key={cartProduct.id}
                    cartProduct={cartProduct}
                  />
                ))}
                <CartSummary
                  totalDiscount={totalDiscount}
                  totalPrice={totalPrice}
                  totalQuantity={totalQuantity}
                />

                <div className={styles.buttonContainer}>
                  <Button
                    variant="contained"
                    onClick={createOrderBtn}
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
