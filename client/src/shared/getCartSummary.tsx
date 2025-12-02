import { CartDto } from "@/types/cart";
import { getDiscountedPrice } from "./getDiscountedPrice";

export function getCartSummary(cartProducts: CartDto[]) {
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

  return { totalQuantity, totalPrice, totalDiscount };
}
