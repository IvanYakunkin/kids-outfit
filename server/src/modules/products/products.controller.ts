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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { ProductMapper } from './mappers/product.mapper';
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
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.productsService.create(createProductDto, files);
  }

  // URL: products?page=1&limit=20&category=phones&sort=price&order=asc&search=iphone
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
  @Get()
  async findAll(@Query() query: QueryProductsDto) {
    return await this.productsService.findAll(query);
  }

  @ApiOperation({
    summary: 'Получить список похожих товаров',
    description: `Возвращает список похожих товаров по категории.`,
  })
  @ApiParam({ name: 'Slug категории', type: String, example: 'futbolki' })
  @ApiParam({
    name: 'Количтество получаемых записей',
    type: Number,
    example: 10,
  })
  @ApiOkResponse({
    description: 'Список товаров получен вместе с мета-информацией о пагинации',
    type: ProductsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Get('similar/:categorySlug/:limit')
  async getSimilar(
    @Param('categorySlug') slug: string,
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<ProductsResponseDto[]> {
    const products = await this.productsService.findSimilarProducts(
      slug,
      limit,
    );

    return products.map(ProductMapper.toResponseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Товар найден', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
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
