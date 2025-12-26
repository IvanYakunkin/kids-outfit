import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CsrfGuard } from '../auth/guards/csrf.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { CartResponseDto } from './dto/cart-response.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard, CsrfGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Добавить товар выбранного размера в корзину' })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({
    status: 201,
    description: 'Товар добавлен в корзину',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Товар уже есть в корзине' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async createProduct(
    @Body() createCartDto: CreateCartDto,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return await this.cartService.addProduct(+req.user['id'], createCartDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Получить корзину пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Корзина успешно получена',
    type: [CartResponseDto],
  })
  async getCart(@Req() req: Request) {
    if (!req.user || !req.user['id']) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return await this.cartService.findProducts(+req.user['id']);
  }

  @UseGuards(JwtAuthGuard, CsrfGuard)
  @Patch(':productSizeId')
  @ApiOperation({ summary: 'Изменить количество товара в корзине' })
  @ApiParam({
    name: 'productSizeId',
    example: 5,
    description: 'ID варианта товара',
  })
  @ApiBody({ description: 'Измененное количество товара', type: UpdateCartDto })
  @ApiResponse({
    status: 200,
    description: 'Количество успешно обновлено',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Товар не найден в корзине' })
  async updateQuantity(
    @Param('productSizeId', ParseIntPipe) productSizeId: number,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: Request,
  ) {
    if (!req.user || !req.user['id']) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return await this.cartService.updateQuantity(
      req.user['id'],
      productSizeId,
      updateCartDto,
    );
  }

  @UseGuards(JwtAuthGuard, CsrfGuard)
  @Delete(':productSizeId')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiParam({
    name: 'productSizeId',
    example: 15,
    description: 'ID товара в корзине',
  })
  @ApiResponse({
    status: 200,
    description: 'Товар удалён',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async deleteCartProduct(
    @Param('productSizeId', ParseIntPipe) productSizeId: number,
    @Req() req: Request,
  ) {
    if (!req.user || !req.user['id']) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return await this.cartService.deleteProduct(+req.user['id'], productSizeId);
  }
}
