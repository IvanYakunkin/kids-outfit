import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProductImageDto } from 'src/modules/product-images/dto/create-product-image.dto';

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
  @IsNumber()
  @IsNotEmpty({ message: 'Не выбрана категория товара' })
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Изображения товара',
    type: [CreateProductImageDto],
  })
  @Type(() => CreateProductImageDto)
  @ValidateNested({ each: true })
  images?: CreateProductImageDto[];

  @ApiPropertyOptional({
    description: 'Активность товара',
    type: Boolean,
    example: true,
  })
  @IsBoolean({ message: 'Неверный формат активности товара' })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Цена', type: String, example: '1200.25' })
  @IsDecimal()
  @IsNotEmpty({ message: 'Цена не может отсутствовать' })
  price: number;

  @ApiPropertyOptional({
    description: 'Процент скидки на цену товара',
    type: Number,
    example: '20',
  })
  @IsNumber()
  @IsOptional()
  discount?: number;
}
