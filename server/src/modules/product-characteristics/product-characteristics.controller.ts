import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductCharsDto } from './dto/create-product-chars.dto';
import { ProductCharsResponseDto } from './dto/product-chars-response.dto';
import { UpdateProductCharsDto } from './dto/update-product-chars.dto';
import { ProductCharsService } from './product-characteristics.service';

@ApiTags('Product Characteristics')
@Controller('product-characteristics')
export class ProductCharsController {
  constructor(private readonly productCharsService: ProductCharsService) {}

  // TODO: create an endpoint to retrieve all characteristics for a specific product

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать характеристику для товара' })
  @ApiBody({ type: CreateProductCharsDto })
  @ApiResponse({
    status: 201,
    description: 'Характеристика товара успешно создана',
    type: ProductCharsResponseDto,
  })
  async create(@Body() productCharsDto: CreateProductCharsDto) {
    return await this.productCharsService.create(productCharsDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить значение характеристики товара по ID' })
  @ApiParam({ name: 'id', description: 'ID продукта', required: true })
  @ApiBody({
    description: 'Объект с новым значением характеристики',
    type: UpdateProductCharsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Обновленная характеристика товара',
    type: ProductCharsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Характеристика товара не найдена' })
  async update(
    @Param('id') id: string,
    @Body() productCharsDto: UpdateProductCharsDto,
  ) {
    return await this.productCharsService.update(+id, productCharsDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить характеристику товара' })
  @ApiParam({
    name: 'id',
    description: 'ID характеристики товара',
    required: true,
  })
  @ApiResponse({ status: 404, description: 'Характеристика товара не найдена' })
  @ApiResponse({
    status: 204,
    description: 'Характеристика товара удалена',
  })
  async delete(@Param('id') id: number) {
    await this.productCharsService.delete(id);
  }
}
