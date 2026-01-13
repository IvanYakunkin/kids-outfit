import { OrderResponseDto } from '../dto/order-response.dto';
import { Order } from '../entities/order.entity';

export function mapOrderToDto(order: Order): OrderResponseDto {
  return {
    id: order.id,
    address: order.address,
    total: order.total,
    createdAt: order.createdAt,
    status: {
      id: order.status.id,
      name: order.status.name,
    },
    user: order.user.id,
    products: order.products.map((p) => ({
      id: p.id,
      quantity: p.quantity,
      price: p.price,
      productSize: {
        id: p.productSize.id,
        isAvailable: p.productSize.isAvailable,
        quantity: p.productSize.quantity,
        size: {
          id: p.productSize.size.id,
          name: p.productSize.size.name,
        },
        product: {
          id: p.productSize.product.id,
          name: p.productSize.product.name,
          slug: p.productSize.product.slug,
          sku: p.productSize.product.sku,
          isActive: p.productSize.product.isActive,
          description: p.productSize.product.description,
          price: p.productSize.product.price,
          discount: p.productSize.product.discount || 0,
          image: p.productSize.product.images?.reduce(
            (min, img) => (img.id < min.id ? img : min),
            p.productSize.product.images[0],
          ),
        },
      },
    })),
  };
}
