import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Between, Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { MonthlySalesResponseDto } from './dto/monthly-sales-response.dto';
import { YearlySalesResponseDto } from './dto/yearly-sales-response.dto';
import { DailyStatistics } from './entities/daily-statistics.entity';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(DailyStatistics)
    private statsRepository: Repository<DailyStatistics>,
  ) {}

  async getDashboardKpis() {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(now.getDate() - 60);

    const totalCustomers = await this.userRepository.count({
      where: { isAdmin: false },
    });
    const newCustomers = await this.userRepository.count({
      where: {
        isAdmin: false,
        created_at: Between(thirtyDaysAgo, now),
      },
    });

    const totalOrders = await this.orderRepository.count();
    const newOrders = await this.orderRepository.count({
      where: { createdAt: Between(thirtyDaysAgo, now) },
    });

    const currentRevenue = await this.orderRepository
      .createQueryBuilder('o')
      .select('SUM(o.total)', 'sum')
      .where('o.createdAt BETWEEN :start AND :end', {
        start: thirtyDaysAgo,
        end: now,
      })
      .andWhere('o.statusId = :status', {
        status: process.env.DELIVERED_ORDER_STATUS_ID,
      })
      .getRawOne();

    const previousRevenue = await this.orderRepository
      .createQueryBuilder('o')
      .select('SUM(o.total)', 'sum')
      .where('o.createdAt BETWEEN :start AND :end', {
        start: sixtyDaysAgo,
        end: thirtyDaysAgo,
      })
      .andWhere('o.status = :status', {
        status: process.env.DELIVERED_ORDER_STATUS_ID,
      })
      .getRawOne();

    const currSum = parseFloat(currentRevenue.sum) || 0;
    const prevSum = parseFloat(previousRevenue.sum) || 0;

    let revenueTrend = 0;
    if (prevSum > 0)
      revenueTrend = Math.round(((currSum - prevSum) / prevSum) * 100);

    const todayVisitors = await this.getTodayCount();
    const visitorsHistory = await this.getHistory();

    return {
      customers: { total: totalCustomers, added: newCustomers },
      orders: { total: totalOrders, added: newOrders },
      revenue: {
        total: currSum,
        trend: revenueTrend,
      },
      visitors: {
        today: todayVisitors,
        history: visitorsHistory.map((stat) => ({
          date: stat.date,
          count: stat.uniqueVisits,
        })),
      },
    };
  }

  async trackVisit(ip: string) {
    const today = new Date().toISOString().split('T')[0];
    const key = `visits:unique:${today}`;

    await this.redis.pfadd(key, ip);
    await this.redis.expire(key, 172800);
  }

  async getTodayCount(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    return this.redis.pfcount(`visits:unique:${today}`);
  }

  async getHistory() {
    return this.statsRepository.find({ order: { date: 'DESC' }, take: 30 });
  }

  // Transfer data from Redis to Postgresql
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncStatistics() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const dateStr = date.toISOString().split('T')[0];

    const key = `visits:unique:${dateStr}`;
    const count = await this.redis.pfcount(key);

    if (count > 0) {
      let stats = await this.statsRepository.findOne({
        where: { date: dateStr },
      });

      if (stats) {
        stats.uniqueVisits = Number(count);
      } else {
        stats = this.statsRepository.create({
          date: dateStr,
          uniqueVisits: Number(count),
        });
      }

      await this.statsRepository.save(stats);
      await this.redis.del(key);

      this.logger.log(
        `Итоговая синхронизация завершена: ${count} визитов за ${dateStr}`,
      );
    }
  }

  async getMonthlySalesStats() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    const rawSales = await this.orderRepository
      .createQueryBuilder('orders')
      .select('DATE(orders.createdAt)', 'date')
      .addSelect('SUM(orders.total)', 'total')
      .addSelect('COUNT(orders.id)', 'count')
      .where('orders.createdAt >= :startDate', { startDate })
      // .andWhere('orders.status = :status', {
      //   status: process.env.DELIVERED_ORDER_STATUS_ID,
      // })
      .groupBy('DATE(orders.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    const chartData: MonthlySalesResponseDto[] = [];
    for (let i = 0; i <= 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('sv-SE');

      const dayData = rawSales.find((s) => {
        const sDate =
          s.date instanceof Date ? s.date.toLocaleDateString('sv-SE') : s.date;
        return sDate === dateStr;
      });

      chartData.push({
        date: dateStr,
        sales: dayData ? parseFloat(dayData.total) : 0,
        ordersCount: dayData ? parseInt(dayData.count) : 0,
      });
    }

    return chartData.reverse();
  }

  async getYearlySalesStats() {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setDate(1);

    const rawSales = await this.orderRepository
      .createQueryBuilder('orders')
      .select("DATE_TRUNC('month', orders.createdAt)", 'month')
      .addSelect('SUM(orders.total)', 'total')
      .where('orders.createdAt >= :startDate', { startDate })
      // .andWhere('orders.statusId = :statusId', {
      //   statusId: process.env.DELIVERED_ORDER_STATUS_ID,
      // })
      .groupBy("DATE_TRUNC('month', orders.createdAt)")
      .orderBy('month', 'ASC')
      .getRawMany();

    const yearlyData: YearlySalesResponseDto[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toISOString().substring(0, 7);

      const found = rawSales.find(
        (s) => new Date(s.month).toISOString().substring(0, 7) === monthKey,
      );

      yearlyData.push({
        month: monthKey,
        sales: found ? parseFloat(found.total) : 0,
      });
    }

    return yearlyData.reverse();
  }
}
