import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../entities/category.entity';

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Название категории', example: 'Обувь' })
  @IsString()
  @IsNotEmpty({ message: 'Введите название категории' })
  name: string;

  @ApiProperty({
    description: 'ID родительской категории',
    example: 1,
    nullable: true,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  parent?: Category;
}
