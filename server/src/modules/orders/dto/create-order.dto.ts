import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { OrderProductsDto } from 'src/modules/order-products/dto/order-products.dto';

export class CreateOrderDto {
  // @ApiProperty({ description: 'ID Пользователя', type: Number, example: 1 })
  // @IsNumber()
  // @IsNotEmpty({ message: 'Пользователь не выбран' })
  // userId: number;

  @ApiProperty({ description: 'Адрес доставки' })
  @IsString()
  @IsNotEmpty({ message: 'Адрес не может отсутствовать' })
  address: string;

  @ApiProperty({ description: 'Состав заказа', type: [OrderProductsDto] })
  @IsArray()
  @Type(() => OrderProductsDto)
  @ValidateNested({ each: true })
  products: OrderProductsDto[];
}
