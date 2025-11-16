import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ example: 2, description: 'Количество товара' })
  @IsInt({ message: 'Количество должно быть числом' })
  @Type(() => Number)
  @Min(1, { message: 'quantity не может быть меньше 1' })
  quantity: number;

  @ApiProperty({ example: 5, description: 'ID варианта товара (ProductSize)' })
  @IsInt({ message: 'ID Размера товара должен быть числом' })
  @Type(() => Number)
  productSizeId: number;
}
