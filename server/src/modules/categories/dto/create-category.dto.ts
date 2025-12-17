import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Название категории', example: 'Брюки' })
  @IsString()
  @IsNotEmpty({ message: 'Название категории не может быть пустым' })
  name: string;

  @ApiPropertyOptional({
    description: 'Родительская категория',
    type: Number,
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  parentId?: number;
}
