import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ParentCategoryDto } from './parent-category.dto';

export class CategoryResponseDto {
  @ApiProperty({ example: 3, description: 'ID категории' })
  id: number;

  @ApiProperty({ example: 'Обувь', description: 'Название категории' })
  name: string;

  @ApiProperty({ example: 'Obuv', description: 'Slug категории' })
  slug: string;

  @ApiPropertyOptional({
    description: 'ID родительской категории (если есть)',
    type: ParentCategoryDto,
  })
  parent?: ParentCategoryDto | null;

  @ApiPropertyOptional({
    description: 'Список подкатегорий',
    type: () => CategoryResponseDto,
    isArray: true,
  })
  children?: CategoryResponseDto[];
}
