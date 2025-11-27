import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор пользователя',
  })
  id: number;

  @ApiProperty({ example: false, description: 'Флаг администратора' })
  isAdmin: boolean;
}
