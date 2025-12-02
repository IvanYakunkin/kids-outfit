import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderProductResponseDto } from 'src/modules/order-products/dto/order-products-response.dto';
import { StatusResponseDto } from 'src/modules/statuses/dto/status-response.dto';

export class OrderResponseDto {
  @ApiProperty({ description: 'ID заказа' })
  id: number;

  @ApiPropertyOptional({
    description: 'ID пользователя',
    type: Number,
    example: 12,
  })
  user: number;

  @ApiProperty({ description: 'Адрес доставки' })
  address: string;

  @ApiProperty({
    description: 'Состав заказа',
    type: [OrderProductResponseDto],
  })
  products: OrderProductResponseDto[];

  @ApiProperty({
    description: 'ID Статуса заказа',
    type: () => StatusResponseDto,
  })
  status: StatusResponseDto;

  @ApiProperty({
    description: 'Итогова сумма заказа',
    type: String,
    example: '1200.24',
  })
  total: number;

  @ApiProperty({ description: 'Дата оформления заказа' })
  createdAt: Date;
}
