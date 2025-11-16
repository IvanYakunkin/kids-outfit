import { ApiProperty } from '@nestjs/swagger';
import { ProductShortDto } from 'src/modules/products/dto/productShort.dto';

export class CartResponseDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ type: ProductShortDto })
  product: ProductShortDto;
}
