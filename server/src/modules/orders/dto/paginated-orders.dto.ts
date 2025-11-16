import { ApiProperty } from '@nestjs/swagger';
import { GetOrdersDto } from './get-orders.dto';

export class PaginatedOrdersDto {
  @ApiProperty({
    type: [GetOrdersDto],
    description: 'Массив товаров',
  })
  data: GetOrdersDto[];

  @ApiProperty({
    description: 'Информация о пагинации',
    example: {
      total: 250,
      page: 1,
      lastPage: 13,
      limit: 20,
    },
  })
  meta: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}
