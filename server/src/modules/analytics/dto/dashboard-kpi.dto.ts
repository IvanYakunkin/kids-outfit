import { ApiProperty } from '@nestjs/swagger';

class SimpleStatDto {
  @ApiProperty({ example: 5, description: 'Общее количество за все время' })
  total: number;

  @ApiProperty({
    example: 4,
    description: 'Количество, добавленное за последний период',
  })
  added: number;
}

class RevenueStatDto {
  @ApiProperty({ example: 50000, description: 'Общая выручка' })
  total: number;

  @ApiProperty({
    example: 15.5,
    description: 'Процент изменения по сравнению с прошлым периодом',
  })
  trend: number;
}

class VisitorHistoryDto {
  @ApiProperty({
    example: '2025-12-24',
    description: 'Дата в формате YYYY-MM-DD',
  })
  date: string;

  @ApiProperty({
    example: 10,
    description: 'Количество уникальных посетителей',
  })
  count: number;
}

class VisitorsStatDto {
  @ApiProperty({
    example: 10,
    description: 'Количество посетителей сегодня (из Redis)',
  })
  today: number;

  @ApiProperty({
    type: [VisitorHistoryDto],
    description: 'История посещений за прошлые дни (из БД)',
  })
  history: VisitorHistoryDto[];
}

export class DashboardKpisDto {
  @ApiProperty({ type: SimpleStatDto })
  customers: SimpleStatDto;

  @ApiProperty({ type: SimpleStatDto })
  orders: SimpleStatDto;

  @ApiProperty({ type: RevenueStatDto })
  revenue: RevenueStatDto;

  @ApiProperty({ type: VisitorsStatDto })
  visitors: VisitorsStatDto;
}
