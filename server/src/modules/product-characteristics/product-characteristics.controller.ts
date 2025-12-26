import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CsrfGuard } from '../auth/guards/csrf.guard';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductCharsDto } from './dto/create-product-chars.dto';
import { ProductCharsResponseDto } from './dto/product-chars-response.dto';
import { ReplaceProductCharsDto } from './dto/replace-product-chars.dto';
import { ProductCharsService } from './product-characteristics.service';

@ApiTags('Product Characteristics')
@Controller('product-characteristics')
export class ProductCharsController {
  constructor(private readonly productCharsService: ProductCharsService) {}

  // TODO: create an endpoint to retrieve all characteristics for a specific product

  @UseGuards(JwtAuthGuard, AdminGuard, CsrfGuard)
  @ApiBearerAuth()
  @Post(':productId')
  @ApiOperation({ summary: 'Добавить характеристики для товара' })
  @ApiParam({ name: 'ID товара', type: Number })
  @ApiBody({ type: [CreateProductCharsDto] })
  @ApiCreatedResponse({
    description: 'Характеристики для товара успешно добавлены',
    type: [ProductCharsResponseDto],
  })
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() productCharsDto: CreateProductCharsDto[],
  ) {
    return await this.productCharsService.createAll(productId, productCharsDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard, CsrfGuard)
  @ApiBearerAuth()
  @Put(':productId')
  @ApiOperation({ summary: 'Заменить все характеристики товара на новые' })
  @ApiParam({ name: 'productId', description: 'ID товара', required: true })
  @ApiBody({
    description: 'Объект с ID товара и массивом характеристик',
    type: [ReplaceProductCharsDto],
  })
  @ApiResponse({
    status: 200,
    description: 'Все характеристики товара успешно заменены',
    type: [ProductCharsResponseDto],
  })
  async replaceAllChars(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() replaceProductCharsDto: ReplaceProductCharsDto[],
  ) {
    return await this.productCharsService.replaceAll(
      productId,
      replaceProductCharsDto,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard, CsrfGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить характеристику товара' })
  @ApiParam({
    name: 'id',
    description: 'ID характеристики товара',
    required: true,
  })
  @ApiNotFoundResponse({ description: 'Характеристика товара не найдена' })
  @ApiResponse({
    status: 204,
    description: 'Характеристика товара удалена',
  })
  async delete(@Param('id') id: number) {
    await this.productCharsService.delete(id);
  }
}
