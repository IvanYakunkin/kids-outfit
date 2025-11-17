import { ApiProperty } from '@nestjs/swagger';

export class MetaProductsDto {
  @ApiProperty({
    description: 'Всего товаров, соответствующих критерию поиска',
    type: Number,
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: 'Текущая страница',
    type: Number,
    example: 2,
  })
  page: number;

  @ApiProperty({
    description: 'Номер последней страницы, исходя из total и limit',
    type: Number,
    example: 7,
  })
  lastPage: number;

  @ApiProperty({
    description:
      'Максимум элементов, которые требуется получить за один запрос',
    type: Number,
    example: 20,
  })
  limit: number;
}
