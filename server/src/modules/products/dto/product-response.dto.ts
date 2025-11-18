import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryResponseDto } from 'src/modules/categories/dto/category-response.dto';
import { ProductCharsResponseDto } from 'src/modules/product-characteristics/dto/product-chars-response.dto';
import { ProductImageResponseDto } from 'src/modules/product-images/dto/product-image-response.dto';
import { ProductSizesResponseDto } from 'src/modules/product-sizes/dto/product-sizes-response.dto';

export class ProductResponseDto {
  @ApiProperty({ description: 'ID товара', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название', example: 'Футболка' })
  name: string;

  @ApiProperty({ description: 'Slug товара', example: 'futbolka' })
  slug: string;

  @ApiProperty({ description: 'Артикул', example: '12345678' })
  sku: string;

  @ApiProperty({ description: 'Категория', type: CategoryResponseDto })
  category: CategoryResponseDto;

  @ApiPropertyOptional({
    description: 'Размеры товара',
    type: [ProductSizesResponseDto],
  })
  sizes?: ProductSizesResponseDto[];

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
    description: 'Список изображений товара',
    type: [ProductImageResponseDto],
  })
  images?: ProductImageResponseDto[];

  @ApiPropertyOptional({
    description: 'Характеристики товара',
    type: [ProductCharsResponseDto],
  })
  productCharacteristics?: ProductCharsResponseDto[];

  @ApiProperty({ description: 'Дата создания товара в БД' })
  created_at: Date;
}
