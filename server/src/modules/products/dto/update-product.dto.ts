import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Max } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Название', example: 'Футболка' })
  @IsString()
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  name?: string;

  @ApiPropertyOptional({ description: 'Описание' })
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Информация об уходе' })
  @IsString()
  care?: string;

  @ApiPropertyOptional({
    description: 'Категория (ID)',
    type: Number,
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Активность товара',
    example: true,
  })
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Цена',
    type: String,
    example: '1200.25',
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Цена не может отсутствовать' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Процент скидки',
    type: Number,
    example: 20,
  })
  @IsInt()
  @Type(() => Number)
  @Max(99, { message: 'Скидка не может превышать 99%' })
  discount?: number;
}
