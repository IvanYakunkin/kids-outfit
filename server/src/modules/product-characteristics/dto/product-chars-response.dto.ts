import { ApiProperty } from '@nestjs/swagger';
import { CharacteristicResponseDto } from 'src/modules/characteristics/dto/characteristic-response.dto';

export class ProductCharsResponseDto {
  @ApiProperty({ description: 'ID характеристики товара' })
  id: number;

  @ApiProperty({
    description: 'Выбранная характеристика',
    type: CharacteristicResponseDto,
  })
  characteristic: CharacteristicResponseDto;

  @ApiProperty({
    description: 'Значение характеристики товара',
    example: 'Красный',
  })
  value: string;
}
