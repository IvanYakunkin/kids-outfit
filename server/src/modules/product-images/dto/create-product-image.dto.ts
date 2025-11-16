import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ description: 'Путь до изображения', example: 'default.jpg' })
  @IsString()
  @IsNotEmpty({ message: 'Путь изображения не может быть пустым' })
  imageName: string;
}
