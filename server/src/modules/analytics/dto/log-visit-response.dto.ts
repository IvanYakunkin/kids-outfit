import { ApiProperty } from '@nestjs/swagger';

export class LogVisitResponseDto {
  @ApiProperty({
    example: true,
    description: 'Флаг успешного выполнения операции',
  })
  success: boolean;

  @ApiProperty({
    example: '192.168.1.1',
    description: 'Определенный сервером IP-адрес пользователя',
  })
  yourIp: string;
}
