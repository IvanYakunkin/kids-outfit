import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductCharsDto {
  @ApiPropertyOptional({
    description: 'Значение характеристики товара',
    example: 'Красный',
  })
  @IsString()
  @IsOptional()
  value?: string;
}
