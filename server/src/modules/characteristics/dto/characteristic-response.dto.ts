import { ApiProperty } from '@nestjs/swagger';

export class CharacteristicResponseDto {
  @ApiProperty({ description: 'ID характеристики', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название характеристики', example: 'Цвет' })
  value: string;
}
