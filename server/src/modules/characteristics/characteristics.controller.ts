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
import { CharacteristicsService } from './characteristics.service';
import { CharacteristicResponseDto } from './dto/characteristic-response.dto';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';

@ApiTags('Characteristics')
@Controller('characteristics')
export class CharacteristicsController {
  constructor(
    private readonly characteristicsService: CharacteristicsService,
  ) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать характеристику' })
  @ApiBody({ type: CreateCharacteristicDto })
  @ApiResponse({
    status: 201,
    description: 'Характеристика успешно создана',
    type: CharacteristicResponseDto,
  })
  async create(@Body() createOrderDto: CreateCharacteristicDto) {
    return await this.characteristicsService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все характеристики' })
  @ApiResponse({
    status: 200,
    description: 'Список характеристик получен',
    type: CharacteristicResponseDto,
  })
  async findAll() {
    return await this.characteristicsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить характеристику по ID' })
  @ApiParam({ name: 'id', description: 'ID характеристики', required: true })
  @ApiResponse({ status: 404, description: 'Характеристика не найдена' })
  @ApiOkResponse({
    description: 'Характеристика получена',
    type: CharacteristicResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.characteristicsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить характеристику' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: CreateCharacteristicDto })
  @ApiOkResponse({
    description: 'Данные характеристики изменены',
    type: CharacteristicResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Характеристика не найдена',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() characteristicDto: CreateCharacteristicDto,
  ) {
    return await this.characteristicsService.update(id, characteristicDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Удаление характеристики' })
  @ApiParam({
    name: 'id',
    description: 'ID характеристики',
    required: true,
  })
  @ApiResponse({ status: 404, description: 'Характеристика не найдена' })
  @ApiResponse({ status: 204, description: 'Характеристика успешно удалена' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.characteristicsService.delete(id);
  }
}
