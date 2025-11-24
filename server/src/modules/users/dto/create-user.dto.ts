import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description:
      'Имя пользователя (только русские буквы, дефисы или апострофы)',
    maxLength: 50,
    example: 'Иван',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[А-Яа-яЁё'-]+$/, {
    message: 'Имя должно содержать только русские буквы, дефисы или апострофы',
  })
  @MaxLength(50, { message: 'Имя не должно быть больше 50 символов' })
  firstname: string;

  @ApiPropertyOptional({
    description:
      'Отчество пользователя (только русские буквы, дефисы или апострофы)',
    maxLength: 50,
    example: 'Иванович',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[А-Яа-яЁё'-]+$/, {
    message:
      'Отчество должно содержать только русские буквы, дефисы или апострофы',
  })
  @MaxLength(50, { message: 'Отчество не должно быть больше 50 символов' })
  middlename: string;

  @ApiProperty({
    description:
      'Фамилия пользователя (только русские буквы, дефисы или апострофы)',
    maxLength: 50,
    example: 'Петров',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[А-Яа-яЁё'-]+$/, {
    message:
      'Фамилия должна содержать только русские буквы, дефисы или апострофы',
  })
  @MaxLength(50, { message: 'Фамилия не должна быть больше 50 символов' })
  lastname: string;

  @ApiProperty({
    description: 'Телефон в формате РФ',
    example: '+7XXXXXXXXXX',
  })
  @IsNotEmpty()
  @IsPhoneNumber('RU', { message: 'Неверный формат номера телефона' })
  phone: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    minLength: 5,
    maxLength: 50,
    example: 'mypassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Пароль должен быть не меньше 5 символов' })
  @MaxLength(50, { message: 'Пароль не должен быть больше 50 символов' })
  password: string;
}
