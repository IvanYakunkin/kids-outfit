import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Название категории', example: 'Брюки' })
  @IsString()
  @IsNotEmpty({ message: 'Название категории не может быть пустым' })
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
