import { ApiProperty } from '@nestjs/swagger';

export class StatusResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
