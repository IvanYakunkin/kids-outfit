import { ProductSizeResponseDto } from '../dto/product-size-response.dto';
import { ProductSize } from '../entities/product-sizes.entity';

export class ProductSizeToDto {
  static toResponseDto(pSize: ProductSize): ProductSizeResponseDto {
    return {
      id: pSize.id,
      product: {
        id: pSize.product.id,
        name: pSize.product.name,
        sku: pSize.product.sku,
        slug: pSize.product.slug,
        price: pSize.product.price,
        discount: pSize.product.discount || 0,
        image: pSize.product.images?.[0]
          ? {
              id: pSize.product.images[0].id,
              name: pSize.product.images[0].name,
              url: pSize.product.images[0].url,
            }
          : undefined,
      },
      isAvailable: pSize.isAvailable,
      size: {
        id: pSize.size.id,
        name: pSize.size.name,
      },
      quantity: pSize.quantity,
    };
  }
}
