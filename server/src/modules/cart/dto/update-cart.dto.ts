import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiPropertyOptional({ example: 3, description: 'Новое количество товара' })
  @IsInt()
  @Min(1, { message: 'Количество не может быть меньше 1' })
  @Type(() => Number)
  quantity?: number;
}
