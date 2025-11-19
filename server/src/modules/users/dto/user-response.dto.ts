import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор пользователя',
  })
  id: number;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  firstname: string;

  @ApiProperty({ example: 'Иванович', description: 'Отчество пользователя' })
  middlename: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  lastname: string;

  @ApiProperty({
    example: '+79991234567',
    description: 'Телефон пользователя',
  })
  phone: string;

  @ApiProperty({ example: false, description: 'Флаг администратора' })
  isAdmin: boolean;

  @ApiProperty({
    example: '2025-11-19T12:34:56.789Z',
    description: 'Дата создания пользователя',
  })
  created_at: Date;
}
