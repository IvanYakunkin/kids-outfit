import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/modules/categories/entities/category.entity';
import { ProductChars } from 'src/modules/product-characteristics/entities/product-characteristic.entity';
import { ProductImage } from 'src/modules/product-images/entities/product-image.entity';
import { ProductSize } from 'src/modules/product-sizes/entities/product-sizes.entity';

export class ProductResponseDto {
  @ApiProperty({ description: 'ID товара', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название', example: 'Футболка' })
  name: string;

  @ApiProperty({ description: 'Артикул', example: '12345678' })
  sku: string;

  @ApiProperty({ description: 'Категория' })
  category: Category;

  @ApiPropertyOptional({ description: 'Размеры', type: [ProductSize] })
  sizes?: ProductSize[];

  @ApiPropertyOptional({ description: 'Описание' })
  description?: string;

  @ApiPropertyOptional({ description: 'Информация об уходе' })
  care?: string;

  @ApiProperty({ description: 'Цена', example: '1257' })
  price: number;

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

  @ApiPropertyOptional({
    description: 'Характеристики товара',
    type: [ProductChars],
  })
  productCharacteristics?: ProductChars[];

  @ApiProperty({ description: 'Дата создания товара в БД' })
  created_at: Date;
}
