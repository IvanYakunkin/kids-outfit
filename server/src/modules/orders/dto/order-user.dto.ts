import { ApiProperty } from '@nestjs/swagger';

export class OrderUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstname: string;

  @ApiProperty({ nullable: true })
  middlename: string | null;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  created_at: Date;
}
