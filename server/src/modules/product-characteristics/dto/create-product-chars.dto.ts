import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Characteristic } from 'src/modules/characteristics/entities/characteristic.entity';
import { Product } from 'src/modules/products/entities/product.entity';

export class CreateProductCharsDto {
  @ApiProperty({ description: 'ID товара', example: 'Футболка' })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Товар не выбран' })
  product: Product;

  @IsInt()
  @IsNotEmpty({ message: 'Характеристика не выбрана' })
  @Type(() => Number)
  characteristic: Characteristic;

  @IsString()
  @IsNotEmpty({
    message: 'Значение характеристики товара не может быть пустым',
  })
  value: string;
}
