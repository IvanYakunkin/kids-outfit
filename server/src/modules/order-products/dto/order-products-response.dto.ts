import { ApiProperty } from '@nestjs/swagger';
import { ProductSizeResponseDto } from 'src/modules/product-sizes/dto/product-size-response.dto';

export class OrderProductResponseDto {
  @ApiProperty({ description: 'ID записи о товаре в заказе', example: 1 })
  id: number;

  @ApiProperty({
    description: 'ID Размера товара',
    type: () => ProductSizeResponseDto,
  })
  productSize: ProductSizeResponseDto;

  @ApiProperty({ description: 'Количество', example: 2 })
  quantity: number;

  @ApiProperty({ description: 'Итоговая цена заказа', example: '4000.00' })
  price: number;
}
