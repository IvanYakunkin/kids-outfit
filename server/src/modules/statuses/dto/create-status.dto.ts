import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ example: 'Размер', description: 'Наименование статуса' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
