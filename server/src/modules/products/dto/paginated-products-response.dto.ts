import { ApiProperty } from '@nestjs/swagger';
import { MetaProductsDto } from './meta-products.dto';
import { ProductsResponseDto } from './products-response.dto';

export class PaginatedProductsResponseDto {
  @ApiProperty({
    type: [ProductsResponseDto],
    description: 'Массив товаров',
  })
  data: ProductsResponseDto[];

  @ApiProperty({
    description: 'Информация о пагинации',
    type: MetaProductsDto,
  })
  meta: MetaProductsDto;
}
