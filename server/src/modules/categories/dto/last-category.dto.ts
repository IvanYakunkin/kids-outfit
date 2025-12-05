import { ApiProperty } from '@nestjs/swagger';

export class LastCategoryDto {
  @ApiProperty({ example: 3, description: 'ID категории' })
  id: number;

  @ApiProperty({ example: 'Обувь', description: 'Название категории' })
  name: string;

  @ApiProperty({ example: 'Obuv', description: 'Slug категории' })
  slug: string;
}
