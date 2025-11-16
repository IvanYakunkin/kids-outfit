import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCharacteristicDto {
  @ApiProperty({ description: 'Наименование характеристики', example: 'Цвет' })
  @IsString()
  @IsNotEmpty({ message: 'Название характеристики не может быть пустым' })
  value: string;
}
