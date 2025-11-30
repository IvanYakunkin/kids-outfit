import { CartResponseDto } from '../dto/cart-response.dto';
import { Cart } from '../entities/cart.entity';

export function mapCart(cart: Cart): CartResponseDto {
  const p = cart.productSize.product;

  return {
    id: cart.id,
    quantity: cart.quantity,
    productSize: {
      id: cart.productSize.id,
      isAvailable: cart.productSize.isAvailable,
      product: {
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        discount: p.discount || 0,
        slug: p.slug,
        image: p.images
          ? {
              id: p.images[0].id,
              name: p.images[0].name,
              url: p.images[0].url,
            }
          : undefined,
      },
      size: cart.productSize.size,
      quantity: cart.productSize.quantity,
    },
  };
}
