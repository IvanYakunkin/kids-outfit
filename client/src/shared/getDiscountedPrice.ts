export const getDiscountedPrice = (initialPrice: number, discount: number) => {
  return Math.round(initialPrice * (1 - discount / 100));
};
