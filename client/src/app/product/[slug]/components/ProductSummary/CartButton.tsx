"use client";

import { RootState } from "@/redux/store";
import {
  addProductToCart,
  getCart,
  removeProductFromCart,
} from "@/shared/api/cart";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface AddToCartButtonProps {
  selectedSize: { id: number; quantity: number } | null;
}

// Add / delete a product from the cart
export default function CartButton({ selectedSize }: AddToCartButtonProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  // Cart item ids
  const [inCart, setInCart] = useState<number[]>([]);
  const [isButtonLoading, setIsButtonLoading] = useState(true);

  useEffect(() => {
    const getCartProducts = async () => {
      if (!user) {
        setIsButtonLoading(false);
        return;
      }
      const cartResponse = await authRequestWrapper(
        () => getCart(),
        router,
        true
      );

      setIsButtonLoading(false);

      if (cartResponse.ok && cartResponse.data) {
        const ids = cartResponse.data.map(
          (cartProduct) => cartProduct.productSize.id
        );
        setInCart(ids);
      }
    };

    getCartProducts();
  }, [router, user]);

  if (!selectedSize) return null;

  const isOutOfStock = selectedSize.quantity === 0;
  const isInCart = inCart?.includes(selectedSize.id);

  let text = "";
  let disabled = false;
  const color = {
    background: "var(--templatePurple)",
    "&:hover": {
      backgroundColor: "var(--templatePurpleHover)",
    },
  };

  if (isOutOfStock) {
    text = "Товар закончился";
    disabled = true;
  } else if (isInCart) {
    text = "Удалить из корзины";
  } else {
    text = "Добавить в корзину";
  }

  const addToCartBtnClick = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    const addToCartResponse = await authRequestWrapper(
      () => addProductToCart(selectedSize.id),
      router
    );

    if (addToCartResponse.ok) {
      setInCart([...inCart, selectedSize.id]);
    } else {
      console.error(
        "Не удалось добавить товар в коризну!",
        addToCartResponse.error
      );
    }
  };

  const removeFromCartBtnClick = async () => {
    const removeFromCartResponse = await authRequestWrapper(
      () => removeProductFromCart(selectedSize.id),
      router
    );

    if (removeFromCartResponse.ok) {
      setInCart(inCart.filter((productId) => productId !== selectedSize.id));
    } else {
      console.error(
        "Не удалось удалить товар из коризны. Попробуйте позже",
        removeFromCartResponse.error
      );
    }
  };

  return (
    <Button
      variant="contained"
      fullWidth
      size="large"
      disabled={disabled}
      sx={{ mt: 1, ...color }}
      onClick={
        !disabled && !isButtonLoading
          ? isInCart
            ? removeFromCartBtnClick
            : addToCartBtnClick
          : undefined
      }
    >
      {isButtonLoading ? <CircularProgress color="inherit" size={26} /> : text}
    </Button>
  );
}
