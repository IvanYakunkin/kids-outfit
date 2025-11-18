import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductImageResponseDto } from 'src/modules/product-images/dto/product-image-response.dto';

export class ProductShortDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Футболка Kids Basic' })
  name: string;

  @ApiProperty({ example: 'futbolka-kids-basic' })
  slug: string;

  @ApiProperty({ example: 1290 })
  price: number;

  @ApiProperty({ example: '20', description: 'Значение в процентах' })
  discount: number;

  @ApiPropertyOptional({
    example: 'product1.jpg',
    description: 'Главное изображение товара',
    type: String,
  })
  image?: ProductImageResponseDto;
}
