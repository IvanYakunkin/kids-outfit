import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginatedProductsResponseDto } from './dto/paginated-products-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductsResponseDto } from './dto/products-response.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('Products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать новый товар' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Товар успешно создан',
    type: ProductsResponseDto,
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  // URL: products?page=1&limit=20&category=phones&sort=price&order=asc&search=iphone
  @Get()
  @ApiOperation({
    summary: 'Получить каталог товаров',
    description: `Возвращает список товаров с поддержкой пагинации, фильтрации, сортировки и поиска.  
    Используется для вывода каталога товаров с ленивой подгрузкой.`,
  })
  @ApiOkResponse({
    description: 'Список товаров получен вместе с мета-информацией о пагинации',
    type: PaginatedProductsResponseDto,
  })
  @ApiQuery({
    name: 'query',
    required: false,
    style: 'deepObject',
    explode: true,
    type: QueryProductsDto,
  })
  async findAll(@Query() query: QueryProductsDto) {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Товар найден', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @Get('/popular/:quantity')
  @ApiOperation({ summary: 'Получить список популярных товаров (хиты продаж)' })
  @ApiParam({
    name: 'quantity',
    type: Number,
    example: 10,
    description: 'Количество получаемых товаров',
  })
  @ApiOkResponse({ description: 'Товары получены', type: ProductsResponseDto })
  async findPopular(@Param('quantity', ParseIntPipe) quantity: number) {
    return await this.productsService.findPopular(quantity);
  }

  @Get('/last/:quantity')
  @ApiOperation({ summary: 'Получить список последник товаров (новинки)' })
  @ApiParam({
    name: 'quantity',
    type: Number,
    example: 10,
    description: 'Количество получаемых товаров',
  })
  @ApiOkResponse({ description: 'Товары получены', type: ProductsResponseDto })
  async findLast(@Param('quantity', ParseIntPipe) quantity: number) {
    return await this.productsService.findLast(quantity);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Изменить информацию о товаре' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ description: 'Данные товара', type: CreateProductDto })
  @ApiOkResponse({
    description: 'Данные товара изменены',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар по ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Товар удален' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.delete(id);
  }
}
