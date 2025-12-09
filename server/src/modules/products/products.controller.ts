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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageFilesInterceptor } from '../product-images/interceptors/product-image.interceptor';
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Товар успешно создан',
    type: ProductsResponseDto,
  })
  @UseInterceptors(ImageFilesInterceptor('images', 10, 7))
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
    description: `Возвращает список похожих товаров по id категории.`,
  })
  @ApiOkResponse({
    description: 'Список товаров получен',
    type: ProductsResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Категория не найдена' })
  @Get('similar/:categoryId/:limit')
  async getSimilar(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<ProductsResponseDto[]> {
    return await this.productsService.findSimilarProducts(categoryId, limit);
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
  @ApiBody({ description: 'Данные товара', type: UpdateProductDto })
  @ApiOkResponse({
    description: 'Данные товара изменены',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Товар не найден' })
  @UseInterceptors(ImageFilesInterceptor('images', 10, 7))
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
  @ApiNoContentResponse({ description: 'Товар удален' })
  @ApiNotFoundResponse({ description: 'Товар не найден' })
  @ApiConflictResponse({
    description: 'Этот товар уже связан с другими таблицами.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.delete(id);
  }
}
