import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 3, description: 'ID категории' })
  id: number;

  @ApiProperty({ example: 'Обувь', description: 'Название категории' })
  name: string;

  @ApiProperty({ example: 'Obuv', description: 'Slug категории' })
  slug: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID родительской категории (если есть)',
  })
  parentId?: number;

  @ApiProperty({
    description: 'Список подкатегорий',
    type: () => [CategoryResponseDto],
  })
  children: CategoryResponseDto[];
}
