import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductSizeDto {
  @ApiProperty({ example: 2, description: 'ID размера' })
  @IsNumber()
  @IsNotEmpty({ message: 'Не указан размер' })
  sizeId: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Доступность размера',
    required: false,
    default: true,
  })
  @IsBoolean()
  isAvailable?: boolean = true;

  @ApiProperty({
    example: 10,
    description: 'Количество',
    default: 1,
  })
  @IsNumber()
  quantity: number = 1;
}
