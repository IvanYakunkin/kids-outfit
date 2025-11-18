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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить список всех категорий с полной иерархией',
  })
  @ApiResponse({
    status: 200,
    description: 'Получение всего списка категорий',
    type: CategoryResponseDto,
  })
  async findAll() {
    const categories = await this.categoriesService.getFullHierarchy();
    return categories;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать новую категорию (только администратор)' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Категория успешно создана',
    type: CategoryResponseDto,
  })
  createCategory(@Body() categoryDto: CreateCategoryDto) {
    return this.categoriesService.create(categoryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', type: Number, example: 2 })
  @ApiResponse({
    status: 200,
    description: 'Категория получена по ID',
    type: CategoryResponseDto,
  })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.findById(id);
  }

  @Get('/hierarchy/:id')
  @ApiOperation({ summary: 'Получить иерархию категории по ID' })
  @ApiParam({ name: 'id', type: Number, example: 2 })
  @ApiResponse({
    status: 200,
    description: 'Иерархия категории получена',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Категория не найдена по ID' })
  findHierarchy(@Param('id') categoryId: number) {
    return this.categoriesService.getCategoryHierarchy(categoryId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить категорию по ID' })
  @ApiParam({ name: 'id', type: Number, example: 2 })
  @ApiResponse({
    status: 204,
    description: 'Категория удалена',
    type: CategoryResponseDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.delete(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Изменить данные категории' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Данные категории изменены',
    type: CategoryResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCartDto);
  }
}
