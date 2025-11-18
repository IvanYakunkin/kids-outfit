import { ProductsResponseDto } from '../dto/products-response.dto';
import { Product } from '../entities/product.entity';

export class ProductMapper {
  static toResponseDto(product: Product): ProductsResponseDto {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      discount: product.discount,
      image: product.images ? product.images[0] : undefined,
      created_at: product.created_at,
    };
  }
}
