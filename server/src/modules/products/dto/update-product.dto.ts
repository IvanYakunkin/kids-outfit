import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProductImageDto } from 'src/modules/product-images/dto/create-product-image.dto';

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Название', example: 'Футболка' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Описание' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Информация об уходе' })
  @IsString()
  @IsOptional()
  care?: string;

  @ApiPropertyOptional({
    description: 'Категория (ID)',
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Изображения товара',
    type: [CreateProductImageDto],
  })
  @Type(() => CreateProductImageDto)
  @ValidateNested({ each: true })
  @IsOptional()
  images?: CreateProductImageDto[];

  @ApiPropertyOptional({
    description: 'Активность товара',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Цена',
    type: String,
    example: '1200.25',
  })
  @IsDecimal()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Процент скидки',
    type: Number,
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  discount?: number;
}
