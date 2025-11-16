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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/jwt-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStatusDto } from './dto/create-status.dto';
import { Status } from './entities/status.entity';
import { StatusesService } from './statuses.service';

@ApiTags('Statuses')
@Controller('statuses')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать статус' })
  @ApiResponse({
    status: 201,
    description: 'Статус успешно создан',
    type: Status,
  })
  async create(@Body() createStatusDto: CreateStatusDto) {
    return await this.statusesService.create(createStatusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все статусы' })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение статусов',
    type: [Status],
  })
  async findAll() {
    return await this.statusesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить статус по ID' })
  @ApiParam({ name: 'id', description: 'ID статуса', required: true })
  @ApiResponse({ status: 200, description: 'Статус найден', type: Status })
  @ApiResponse({ status: 404, description: 'Статус не найден' })
  async findOne(@Param('id') id: number) {
    return await this.statusesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить статус по ID' })
  @ApiParam({ name: 'id', description: 'ID статуса', required: true })
  @ApiResponse({ status: 204, description: 'Статус успешно удален' })
  @ApiResponse({ status: 404, description: 'Статус не найден' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.statusesService.delete(id);
  }
}
