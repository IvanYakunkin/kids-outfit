import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OrderProductsDto {
  @ApiProperty({ description: 'ID Товара', type: Number, example: 3 })
  @IsNumber()
  @IsNotEmpty({ message: 'ID Товара не может отстутствовать' })
  productId: number;

  @ApiProperty({ description: 'ID Размера товара', type: Number, example: 8 })
  @IsNumber()
  @IsNotEmpty({ message: 'ID Размера товара не может отсутствовать' })
  productSizeId: number;

  @ApiProperty({ description: 'Количество', type: Number, example: 2 })
  @IsNumber()
  @Min(1, { message: 'Количество не может быть меньше 1' })
  quantity: number;
}
