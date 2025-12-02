import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { PaginatedOrdersDto } from './dto/paginated-orders.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { UpdateOrderResponseDto } from './dto/update-order-response.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartService: CartService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Оформить заказ' })
  @ApiBody({ description: 'Данные заказа', type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Заказ успешно оформлен',
  })
  @ApiForbiddenResponse({ description: 'Достигнут лимит активных заказов.' })
  @ApiResponse({ status: 404, description: 'Ошибка запроса' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const userId = +req.user['id'];
    const newOrder = this.ordersService.create(userId, createOrderDto);
    await this.cartService.clearCart(userId);

    return newOrder;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Получить заказы текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список заказов пользователя успешно получен',
    type: [OrderResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
  @Get('my')
  async findOrdersByUser(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return this.ordersService.findOrdersByUser(req.user['id']);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Получить список всех заказов с пагинацией и фильтрами',
  })
  @ApiResponse({
    status: 200,
    description: 'Список заказов с пагинацией',
    type: PaginatedOrdersDto,
  })
  @Get()
  async getOrders(@Query() query: QueryOrdersDto) {
    return this.ordersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiOkResponse({ description: 'Заказ получен по ID', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Заказ не найден по ID' })
  @Get(':id')
  async findOrderById(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.findOrderById(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Изменить данные заказа' })
  @ApiParam({ name: 'ID заказа', type: Number, example: 2 })
  @ApiBody({ description: 'Измененные поля заказа', type: UpdateOrderDto })
  @ApiOkResponse({
    description: 'Данные заказа успешно изменены',
    type: UpdateOrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
