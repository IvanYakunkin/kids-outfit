import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class QueryOrdersDto {
  @ApiPropertyOptional({ description: 'Номер страницы', example: 1 })
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Количество заказов на странице',
    example: 20,
  })
  @IsInt()
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Фильтр по статусу заказа',
    example: '1',
  })
  @IsOptional()
  @IsInt()
  statusId?: number;

  @ApiPropertyOptional({
    example: 'Иванов Иван Иванович',
    description: 'Поиск заказа',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Фильтр по пользователю', example: '5' })
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'Порядок сортировки (ASC или DESC)',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(['ASC', 'DESC'], { message: 'Неверный формат сортировки' })
  sort?: 'ASC' | 'DESC' = 'DESC';
}
