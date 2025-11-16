import { ApiProperty } from '@nestjs/swagger';
import { StatusResponseDto } from 'src/modules/statuses/dto/status-response.dto';
import { OrderUserDto } from './order-user.dto';

export class GetOrdersDto {
  @ApiProperty({ description: 'ID заказа' })
  id: number;

  @ApiProperty({
    description: 'Пользователь, оформивший заказ',
    type: OrderUserDto,
  })
  user: OrderUserDto;

  @ApiProperty({ description: 'Адрес доставки' })
  address: string;

  @ApiProperty({ description: 'Статус заказа' })
  status: StatusResponseDto;

  @ApiProperty({
    description: 'Итоговая сумма',
    example: '4000.00',
  })
  total: string;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;
}
