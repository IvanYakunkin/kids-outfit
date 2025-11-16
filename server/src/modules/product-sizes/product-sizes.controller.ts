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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductSizeDto } from './dto/create-product-size.dto';
import { UpdateProductSizeDto } from './dto/update-product-size.dto';
import { ProductSize } from './entities/product-sizes.entity';
import { ProductSizesService } from './product-sizes.service';

@ApiTags('Product Sizes')
@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать размер товара' })
  @ApiBody({ type: CreateProductSizeDto })
  @ApiResponse({
    status: 201,
    description: 'Размер товара успешно создан',
    type: CreateProductSizeDto,
  })
  async create(@Body() CreateProductSizeDto: CreateProductSizeDto) {
    return await this.productSizesService.create(CreateProductSizeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить размер товара по ID' })
  @ApiResponse({
    status: 200,
    description: 'Размер товара найден.',
    type: ProductSize,
  })
  @ApiResponse({ status: 404, description: 'Размер товара не найден' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.productSizesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные размера товара' })
  @ApiParam({ name: 'ID Размера товара', type: Number, example: 2 })
  @ApiBody({ description: 'Данные для обновления', type: UpdateProductSizeDto })
  @ApiOkResponse({
    description: 'Данные размера товара изменены',
    type: ProductSize,
  })
  @ApiResponse({ status: 404, description: 'Размер товара не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductSizeDto: UpdateProductSizeDto,
  ) {
    return await this.productSizesService.update(id, updateProductSizeDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить размер товара по ID' })
  @ApiResponse({ status: 200, description: 'Размер товара успешно удален' })
  @ApiResponse({ status: 404, description: 'Размер товара не найден' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.productSizesService.delete(id);
  }

  @Get('/product/:productId')
  @ApiOperation({ summary: 'Получить все размеры товара по ID товара' })
  @ApiResponse({
    status: 200,
    description: 'Размеры товара успешно получены',
    type: [ProductSize],
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден или размеры отсутствуют.',
  })
  async getSizesByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return await this.productSizesService.findByProductId(productId);
  }
}
