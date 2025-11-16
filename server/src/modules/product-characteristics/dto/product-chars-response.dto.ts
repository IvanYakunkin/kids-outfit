import { ApiProperty } from '@nestjs/swagger';
import { Characteristic } from 'src/modules/characteristics/entities/characteristic.entity';
import { Product } from 'src/modules/products/entities/product.entity';

export class ProductCharsResponseDto {
  @ApiProperty({ description: 'ID характеристики товара' })
  id: number;

  @ApiProperty({ description: 'Выбранный товар', type: Product })
  product: Product;

  @ApiProperty({
    description: 'Выбранная характеристика',
    type: Characteristic,
  })
  characteristic: Characteristic;

  @ApiProperty({
    description: 'Значение характеристики товара',
    example: 'Красный',
  })
  value: string;
}
