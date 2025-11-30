import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Название', example: 'Футболка' })
  @IsString()
  @IsNotEmpty({ message: 'Название товара не может быть пустым' })
  name: string;

  @ApiPropertyOptional({ description: 'Описание' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Информация об уходе' })
  @IsString()
  @IsOptional()
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
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Цена', type: String, example: '1200.25' })
  @IsInt()
  @IsNotEmpty({ message: 'Цена не может отсутствовать' })
  price: number;

  @ApiPropertyOptional({
    description: 'Процент скидки на цену товара',
    type: Number,
    example: '20',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  discount?: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Изображения товара',
  })
  images: Express.Multer.File[];
}
