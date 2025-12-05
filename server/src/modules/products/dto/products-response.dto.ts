import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LastCategoryDto } from 'src/modules/categories/dto/last-category.dto';
import { ProductImageResponseDto } from 'src/modules/product-images/dto/product-image-response.dto';

export class ProductsResponseDto {
  @ApiProperty({ description: 'ID товара', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название', example: 'Футболка' })
  name: string;

  @ApiProperty({ description: 'Slug товара', example: 'futbolka' })
  slug: string;

  @ApiProperty({ description: 'Число продаж', example: 100, default: 0 })
  sold: number;

  @ApiProperty({ description: 'Категория товара', type: LastCategoryDto })
  category?: LastCategoryDto;

  @ApiProperty({
    description: 'Активность товара',
    type: Boolean,
    example: false,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({ description: 'Артикул товара', type: String })
  sku: string;

  @ApiProperty({ description: 'Цена', example: 1257 })
  price: number;

  @ApiPropertyOptional({
    description: 'Скидка в процентах',
    example: '20',
  })
  discount?: number;

  @ApiPropertyOptional({
    description: 'Изображения товара',
    type: ProductImageResponseDto,
  })
  image?: ProductImageResponseDto;

  @ApiProperty({ description: 'Дата создания товара в БД' })
  created_at: Date;
}
