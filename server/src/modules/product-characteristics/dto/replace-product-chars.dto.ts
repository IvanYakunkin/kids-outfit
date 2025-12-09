import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Characteristic } from 'src/modules/characteristics/entities/characteristic.entity';

export class ReplaceProductCharsDto {
  @ApiProperty({ description: 'ID характеристики', example: 5 })
  @IsInt()
  @IsNotEmpty({ message: 'Характеристика не выбрана' })
  @Type(() => Number)
  characteristic: Characteristic;

  @ApiProperty({ description: 'Значение характеристики', example: 'Белый' })
  @IsString()
  @IsNotEmpty({
    message: 'Значение характеристики товара не может быть пустым',
  })
  value: string;
}
