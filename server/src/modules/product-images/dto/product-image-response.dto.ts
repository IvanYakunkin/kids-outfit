import { ApiProperty } from '@nestjs/swagger';

export class ProductImageResponseDto {
  @ApiProperty({ description: 'Уникальный идентификатор изображения' })
  id: number;

  @ApiProperty({ description: 'Оригинальное имя файла изображения' })
  name: string;

  @ApiProperty({ description: 'URL изображения в облаке' })
  url: string;
}
