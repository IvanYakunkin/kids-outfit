import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSizeDto } from './dto/create-size.dto';
import { SizeResponseDto } from './dto/size-response.dto';
import { Size } from './entities/size.entity';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Size)
    private sizeRepository: Repository<Size>,
  ) {}

  async create(createSizeDto: CreateSizeDto) {
    const size = this.sizeRepository.create(createSizeDto);
    return await this.sizeRepository.save(size);
  }

  async delete(id: number) {
    const size = await this.sizeRepository.findOneBy({ id });
    if (!size) {
      throw new NotFoundException('Размер не найден');
    }

    await this.sizeRepository.remove(size);
  }

  async findAll(): Promise<SizeResponseDto[]> {
    return await this.sizeRepository.find();
  }
}
