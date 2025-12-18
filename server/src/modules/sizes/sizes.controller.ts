import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSizeDto } from './dto/create-size.dto';
import { SizeResponseDto } from './dto/size-response.dto';
import { SizesService } from './sizes.service';

@ApiTags('Sizes')
@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Получить все размеры' })
  @ApiResponse({
    status: 200,
    description: 'Список размеров успешно получен.',
    type: SizeResponseDto,
  })
  async getAll() {
    return await this.sizesService.findAll();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать новый размер' })
  @ApiBody({ type: CreateSizeDto })
  @ApiResponse({
    status: 201,
    description: 'Размер успешно создан.',
    type: CreateSizeDto,
  })
  async create(@Body() createSizeDto: CreateSizeDto) {
    return await this.sizesService.create(createSizeDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить размер по ID' })
  @ApiParam({ name: 'id', description: 'ID размера', required: true })
  @ApiResponse({ status: 204, description: 'Размер успешно удален.' })
  @ApiNotFoundResponse({ description: 'Размер не найден' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.sizesService.delete(id);
  }
}
