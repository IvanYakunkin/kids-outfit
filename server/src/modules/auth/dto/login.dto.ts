import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Номер телефона пользователя в формате РФ',
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
