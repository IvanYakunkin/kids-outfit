import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryProductsDto {
  @ApiPropertyOptional({ example: 1, description: 'Номер страницы' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'Количество товаров на странице',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(100, { message: 'Невозможно получить более 100 записей' })
  limit: number = 20;

  @ApiPropertyOptional({ example: 'clothes', description: 'Slug категории' })
  @IsOptional()
  @IsString()
  category: string;

  @ApiPropertyOptional({
    example: 'футболка',
    description: 'Поиск по названию',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'price', description: 'Поле для сортировки' })
  @IsOptional()
  @IsString()
  sort: string = 'id';

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'Порядок сортировки (ASC или DESC)',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(['ASC', 'DESC'], { message: 'Неверный формат сортировки' })
  order: 'ASC' | 'DESC' = 'ASC';
}
