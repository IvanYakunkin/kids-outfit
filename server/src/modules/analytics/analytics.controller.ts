import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { DashboardKpisDto } from './dto/dashboard-kpi.dto';
import { LogVisitResponseDto } from './dto/log-visit-response.dto';
import { MonthlySalesResponseDto } from './dto/monthly-sales-response.dto';
import { YearlySalesResponseDto } from './dto/yearly-sales-response.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('kpis')
  @ApiOperation({ summary: 'Получение ключевых показателей (KPI)' })
  @ApiOkResponse({
    description: 'Возвращает статистику',
    type: DashboardKpisDto,
  })
  async getKpis() {
    return this.analyticsService.getDashboardKpis();
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('hit')
  @ApiOperation({
    summary: 'Регистрация посещения сайта',
    description:
      'Извлекает IP из заголовков или сокета и сохраняет уникальный визит в Redis',
  })
  @ApiHeader({
    name: 'x-forwarded-for',
    description: 'IP-адрес пользователя',
    required: false,
    schema: { default: '127.0.0.1' },
  })
  @ApiCreatedResponse({
    description: 'Визит успешно засчитан',
    type: LogVisitResponseDto,
  })
  @ApiResponse({ status: 201, description: 'Визит успешно засчитан' })
  async logVisit(@Req() req: Request) {
    const rawIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();
    await this.analyticsService.trackVisit(ip);

    return { success: true, yourIp: ip };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('sales-per-month')
  @ApiOperation({
    summary: 'Получить статистику продаж за последние 30 дней',
    description:
      'Возвращает массив данных сгруппированных по дням для построения графика.',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение статистики',
    type: [MonthlySalesResponseDto],
  })
  async getSalesStats(): Promise<MonthlySalesResponseDto[]> {
    return this.analyticsService.getMonthlySalesStats();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('sales-per-year')
  @ApiOperation({
    summary: 'Продажи за год (по месяцам)',
    description: 'Массив данных для годового графика.',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение годовой статистики',
    type: [YearlySalesResponseDto],
  })
  async getYearlyStats(): Promise<YearlySalesResponseDto[]> {
    return this.analyticsService.getYearlySalesStats();
  }
}
