import { ApiProperty } from '@nestjs/swagger';

export class ProductImageResponseDto {
  @ApiProperty({ description: 'ID Изображения', example: 1 })
  id: number;

  @ApiProperty({ description: 'Путь до изображения', example: 'default.jpg' })
  imageName: string;
}
