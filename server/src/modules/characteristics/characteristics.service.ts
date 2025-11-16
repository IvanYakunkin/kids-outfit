import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacteristicResponseDto } from './dto/characteristic-response.dto';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import { Characteristic } from './entities/characteristic.entity';

@Injectable()
export class CharacteristicsService {
  constructor(
    @InjectRepository(Characteristic)
    private characteristicsRepository: Repository<Characteristic>,
  ) {}

  async findAll(): Promise<CharacteristicResponseDto[]> {
    return await this.characteristicsRepository.find();
  }

  async create(
    characteristicDto: CreateCharacteristicDto,
  ): Promise<CharacteristicResponseDto> {
    const characteristic =
      this.characteristicsRepository.create(characteristicDto);
    return await this.characteristicsRepository.save(characteristic);
  }

  async findById(id: number): Promise<CharacteristicResponseDto> {
    const characteristic = await this.characteristicsRepository.findOneBy({
      id,
    });
    if (!characteristic) {
      throw new NotFoundException('Характеристика не найдена');
    }

    return characteristic;
  }

  async update(id: number, characteristicDto: CreateCharacteristicDto) {
    const characteristic = await this.characteristicsRepository.findOne({
      where: { id },
    });

    if (!characteristic) {
      throw new NotFoundException('Характеристика не найдена');
    }

    characteristic.value = characteristicDto.value;

    return await this.characteristicsRepository.save(characteristic);
  }

  async delete(id: number) {
    const characteristic = await this.characteristicsRepository.findOne({
      where: { id },
    });

    if (!characteristic) {
      throw new NotFoundException('Характеристика не найдена');
    }

    await this.characteristicsRepository.remove(characteristic);
  }
}
