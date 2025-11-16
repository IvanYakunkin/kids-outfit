import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto';
import { StatusResponseDto } from './dto/status-response.dto';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private statusesRepository: Repository<Status>,
  ) {}

  async create(createStatusDto: CreateStatusDto): Promise<StatusResponseDto> {
    const status = this.statusesRepository.create(createStatusDto);
    return await this.statusesRepository.save(status);
  }

  async findAll(): Promise<StatusResponseDto[]> {
    return await this.statusesRepository.find();
  }

  async findOne(id: number): Promise<StatusResponseDto | null> {
    const status = await this.statusesRepository.findOneBy({ id });
    if (!id) {
      throw new NotFoundException(`Статус с id ${id} не найден`);
    }

    return status;
  }

  async delete(id: number) {
    const status = await this.statusesRepository.findOneBy({ id });
    if (!status) {
      throw new NotFoundException('Статус не найден');
    }

    await this.statusesRepository.remove(status);
  }
}
