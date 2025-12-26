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
import { CsrfGuard } from '../auth/guards/csrf.guard';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductSizeDto } from './dto/create-product-size.dto';
import { ProductSizeResponseDto } from './dto/product-size-response.dto';
import { ProductSizesResponseDto } from './dto/product-sizes-response.dto';
import { UpdateProductSizeDto } from './dto/update-product-size.dto';
import { ProductSize } from './entities/product-sizes.entity';
import { ProductSizesService } from './product-sizes.service';

@ApiTags('Product Sizes')
@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  @UseGuards(JwtAuthGuard, AdminGuard, CsrfGuard)
  @ApiBearerAuth()
  @Post(':productId')
  @ApiOperation({ summary: 'Создать размеры для товара' })
  @ApiParam({ name: 'ID товара', type: Number })
  @ApiBody({ type: [CreateProductSizeDto] })
  @ApiResponse({
    status: 201,
    description: 'Размеры добавлены для товара',
    type: [ProductSizeResponseDto],
  })
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createProductSizeDto: CreateProductSizeDto[],
  ) {
    return await this.productSizesService.createAll(
      productId,
      createProductSizeDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить размер товара по ID' })
  @ApiResponse({
    status: 200,
    description: 'Размер товара найден.',
    type: ProductSizeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Размер товара не найден' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.productSizesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard, CsrfGuard)
  @ApiBearerAuth()
  @Patch(':productId')
  @ApiOperation({ summary: 'Обновить данные размера товара' })
  @ApiParam({ name: 'ID товара', type: Number, example: 2 })
  @ApiBody({
    description: 'Данные для обновления',
    type: [UpdateProductSizeDto],
  })
  @ApiOkResponse({
    description: 'Данные размера товара изменены',
    type: ProductSize,
  })
  @ApiResponse({ status: 404, description: 'Размер товара не найден' })
  async update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateProductSizeDto: UpdateProductSizeDto[],
  ) {
    return await this.productSizesService.update(
      productId,
      updateProductSizeDto,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard, CsrfGuard)
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
    type: [ProductSizesResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден или размеры отсутствуют.',
  })
  async getSizesByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return await this.productSizesService.findByProductId(productId);
  }
}
