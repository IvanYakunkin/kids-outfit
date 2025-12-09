import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt } from 'class-validator';

export class UpdateProductSizeDto {
  @ApiPropertyOptional({
    example: 2,
    description:
      'ID размера товара. Если присутствует, значит у этого размера нужно обновить только поле quantity',
  })
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({ example: 2, description: 'ID размера' })
  @IsInt()
  @Type(() => Number)
  sizeId?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Доступность размера',
  })
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    example: 10,
    description: 'Количество',
  })
  @IsInt()
  @Type(() => Number)
  quantity?: number;
}
