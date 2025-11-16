import { CartResponseDto } from '../dto/cart-response.dto';
import { Cart } from '../entities/cart.entity';

export function mapCart(cart: Cart): CartResponseDto {
  const p = cart.productSize.product;

  return {
    id: cart.id,
    quantity: cart.quantity,
    product: {
      id: p.id,
      name: p.name,
      price: p.price,
      discount: p.discount ?? 0,
      image: (p.images && p.images[0].imageName) || '',
    },
  };
}
