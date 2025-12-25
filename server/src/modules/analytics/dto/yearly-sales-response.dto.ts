import { ApiProperty } from '@nestjs/swagger';

export class YearlySalesResponseDto {
  @ApiProperty({
    example: '2025-01',
    description: 'Год и месяц в формате YYYY-MM',
  })
  month: string;

  @ApiProperty({
    example: 450000,
    description: 'Общая сумма продаж за этот месяц',
  })
  sales: number;
}
