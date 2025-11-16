import { ApiProperty } from '@nestjs/swagger';
import { ProductsResponseDto } from './products-response.dto';

export class PaginatedProductsResponseDto {
  @ApiProperty({
    type: [ProductsResponseDto],
    description: 'Массив товаров',
  })
  data: ProductsResponseDto[];

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
    lastPage: number;
    limit: number;
  };
}
