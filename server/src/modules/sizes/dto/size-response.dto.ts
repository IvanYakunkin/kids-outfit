import { ApiProperty } from '@nestjs/swagger';

export class SizeResponseDto {
  @ApiProperty({ description: 'ID Размера', type: Number, example: 1 })
  id: number;

  @ApiProperty({ description: 'Название размера', example: '134' })
  name: string;
}
