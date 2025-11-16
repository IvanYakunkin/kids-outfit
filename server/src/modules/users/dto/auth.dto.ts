import { IsString, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
