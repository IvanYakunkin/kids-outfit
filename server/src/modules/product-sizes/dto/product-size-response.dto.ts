import { ApiProperty } from '@nestjs/swagger';
import { ProductShortDto } from 'src/modules/products/dto/productShort.dto';
import { SizeResponseDto } from 'src/modules/sizes/dto/size-response.dto';

export class ProductSizeResponseDto {
  @ApiProperty({ description: 'ID размера товара', example: 1 })
  id: number;

  @ApiProperty({ description: 'Товар', type: ProductShortDto })
  product: ProductShortDto;

  @ApiProperty({
    description: 'Доступность размера товара',
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({ description: 'Размер товара', type: SizeResponseDto })
  size: SizeResponseDto;

  @ApiProperty({ description: 'Количество товара', example: 12 })
  quantity: number;
}
