import { ApiProperty } from '@nestjs/swagger';
import { SizeResponseDto } from 'src/modules/sizes/dto/size-response.dto';

export class ProductSizesResponseDto {
  @ApiProperty({ description: 'ID размера товара', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Доступность размера товара',
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({ description: 'ID размера', type: SizeResponseDto })
  size: SizeResponseDto;

  @ApiProperty({ description: 'Количество товара', example: 12 })
  quantity: number;
}
