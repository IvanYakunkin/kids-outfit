import { ApiProperty } from '@nestjs/swagger';

export class MonthlySalesResponseDto {
  @ApiProperty({ example: '2023-12-24', description: 'Дата дня' })
  date: string;

  @ApiProperty({ example: 15400, description: 'Сумма продаж за день' })
  sales: number;

  @ApiProperty({ example: 5, description: 'Количество заказов за день' })
  ordersCount: number;
}
