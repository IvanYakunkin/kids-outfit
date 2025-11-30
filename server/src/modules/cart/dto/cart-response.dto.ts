import { ApiProperty } from '@nestjs/swagger';
import { ProductSizeResponseDto } from 'src/modules/product-sizes/dto/product-size-response.dto';

export class CartResponseDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ type: ProductSizeResponseDto })
  productSize: ProductSizeResponseDto;
}
