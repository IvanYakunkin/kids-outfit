import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Max } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Название', example: 'Футболка' })
  @IsString()
  @IsNotEmpty({ message: 'Название товара не может быть пустым' })
  name: string;

  @ApiPropertyOptional({ description: 'Описание' })
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Информация об уходе' })
  @IsString()
  care?: string;

  @ApiProperty({ description: 'Категория', type: Number, example: 1 })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Не выбрана категория товара' })
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Активность товара',
    type: Boolean,
    example: true,
  })
  @IsBoolean({ message: 'Неверный формат активности товара' })
  isActive?: boolean = true;

  @ApiProperty({ description: 'Цена', type: Number, example: '1200.25' })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Цена не может отсутствовать' })
  price: number;

  @ApiPropertyOptional({
    description: 'Процент скидки на цену товара',
    type: Number,
    example: '20',
  })
  @IsInt()
  @Type(() => Number)
  @Max(99, { message: 'Скидка не может превышать 99%' })
  discount?: number;
}
