import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty({ description: 'Название размера', example: '134' })
  @IsString()
  @IsNotEmpty({ message: 'Значение размера не может быть пустым' })
  name: string;
}
