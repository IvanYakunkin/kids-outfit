export const getDiscountedPrice = (initialPrice: number, discount: number) => {
  if (discount === 0) {
    return initialPrice;
  }
  return Math.round(initialPrice * (1 - discount / 100));
};
