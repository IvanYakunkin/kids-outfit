import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';

export class QueryOrdersDto {
  @ApiPropertyOptional({ description: 'Номер страницы', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Количество заказов на странице',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Фильтр по статусу заказа',
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  statusId?: number;

  @ApiPropertyOptional({ description: 'Фильтр по пользователю', example: '5' })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'Порядок сортировки (ASC или DESC)',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(['ASC', 'DESC'], { message: 'Неверный формат сортировки' })
  sort?: 'ASC' | 'DESC' = 'DESC';
}
