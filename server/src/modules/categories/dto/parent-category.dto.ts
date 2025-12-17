import { ApiProperty } from '@nestjs/swagger';

export class ParentCategoryDto {
  @ApiProperty({
    example: 2,
    description: 'ID родительской категории',
  })
  id: number;

  @ApiProperty({
    example: 'Брюки',
    description: 'Название родительской категории',
  })
  name: string;

  @ApiProperty({
    example: 'elektronika',
    description: 'Slug родительской категории',
  })
  slug: string;
}
