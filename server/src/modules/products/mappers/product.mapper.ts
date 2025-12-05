import { Category } from 'src/modules/categories/entities/category.entity';
import { ProductsResponseDto } from '../dto/products-response.dto';
import { Product } from '../entities/product.entity';

export class ProductMapper {
  static toResponseDto(
    product: Product,
    lastCategory?: Category,
  ): ProductsResponseDto {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sold: product.sold,
      sku: product.sku,
      isActive: product.isActive,
      price: product.price,
      discount: product.discount,
      category: lastCategory
        ? {
            id: lastCategory.id,
            name: lastCategory.name,
            slug: lastCategory.slug,
          }
        : undefined,
      image: product.images?.[0],
      created_at: product.created_at,
    };
  }

  static toShortResponseDto(product: Product) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.category,
      sizes: product.sizes,
      description: product.description,
      care: product.care,
      price: product.price,
      discount: product.discount,
      images: product.images?.map((img) => ({
        id: img.id,
        name: img.name,
        url: img.url,
      })),
      productCharacteristics: product.productCharacteristics,
      created_at: product.created_at,
    };
  }
}
