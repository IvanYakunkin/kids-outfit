import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({ description: 'Пользователь' })
  user: Omit<User, 'password'>;
  @ApiProperty({ description: 'Токены' })
  tokens: {
    refreshToken: string;
    accessToken: string;
  };
}
