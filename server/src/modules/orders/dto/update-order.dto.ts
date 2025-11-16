import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'ID Статуса', type: Number, example: 2 })
  @IsOptional()
  @IsNumber()
  statusId?: number;
}
