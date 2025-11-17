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
      category: product.category,
      discount: product.discount,
      images: product.images,
      created_at: product.created_at,
    };
  }
}
