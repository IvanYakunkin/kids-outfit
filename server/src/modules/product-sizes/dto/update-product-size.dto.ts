import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductSizeDto {
  @ApiPropertyOptional({ example: 2, description: 'ID размера' })
  @IsOptional()
  @IsNumber()
  sizeId?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Доступность размера',
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    example: 10,
    description: 'Количество',
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
