import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/modules/categories/entities/category.entity';
import { ProductImage } from 'src/modules/product-images/entities/product-image.entity';

export class ProductsResponseDto {
  @ApiProperty({ description: 'ID товара', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название', example: 'Футболка' })
  name: string;

  @ApiProperty({ description: 'Артикул', example: '12345678' })
  sku: string;

  @ApiProperty({ description: 'Цена', example: 1257 })
  price: number;

  @ApiProperty({ description: 'Категория', type: Category })
  category: Category;

  @ApiPropertyOptional({
    description: 'Скидка в процентах',
    example: '20',
  })
  discount?: number;

  @ApiPropertyOptional({
    description: 'Изображения товара',
    type: [ProductImage],
  })
  images?: ProductImage[];

  @ApiProperty({ description: 'Дата создания товара в БД' })
  created_at: Date;
}
