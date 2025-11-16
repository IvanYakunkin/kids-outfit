import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderResponseDto {
  @ApiProperty({ description: 'ID заказа' })
  id: number;

  @ApiProperty({ description: 'Адрес доставки' })
  address: string;

  @ApiProperty({ description: 'ID Статуса заказа', example: 1 })
  status: number;

  @ApiProperty({ description: 'Итоговая сумма заказа', example: '4000.00' })
  total: string;

  @ApiProperty({ description: 'Дата оформления заказа' })
  createdAt: Date;
}
