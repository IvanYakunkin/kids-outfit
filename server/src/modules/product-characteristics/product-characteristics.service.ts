import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCharsDto } from './dto/create-product-chars.dto';
import { ProductCharsResponseDto } from './dto/product-chars-response.dto';
import { UpdateProductCharsDto } from './dto/update-product-chars.dto';
import { ProductChars } from './entities/product-characteristic.entity';

@Injectable()
export class ProductCharsService {
  constructor(
    @InjectRepository(ProductChars)
    private productCharsRepository: Repository<ProductChars>,
  ) {}

  async create(
    productCharsDto: CreateProductCharsDto,
  ): Promise<ProductCharsResponseDto> {
    const productChar = this.productCharsRepository.create(productCharsDto);
    return await this.productCharsRepository.save(productChar);
  }

  async delete(id: number) {
    await this.productCharsRepository.delete(id);
  }

  async update(
    id: number,
    updateProductCharsDto: UpdateProductCharsDto,
  ): Promise<ProductCharsResponseDto> {
    const productCharacteristic = await this.productCharsRepository.findOneBy({
      id,
    });
    if (!productCharacteristic) {
      throw new NotFoundException('Характеристика товара не найдена!');
    }

    if (updateProductCharsDto.value) {
      productCharacteristic.value = updateProductCharsDto.value;
    }

    return await this.productCharsRepository.save(productCharacteristic);
  }
}
