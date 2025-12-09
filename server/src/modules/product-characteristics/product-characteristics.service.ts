import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Characteristic } from '../characteristics/entities/characteristic.entity';
import { Product } from '../products/entities/product.entity';
import { CreateProductCharsDto } from './dto/create-product-chars.dto';
import { ProductCharsResponseDto } from './dto/product-chars-response.dto';
import { ReplaceProductCharsDto } from './dto/replace-product-chars.dto';
import { ProductChars } from './entities/product-characteristic.entity';

@Injectable()
export class ProductCharsService {
  constructor(
    @InjectRepository(ProductChars)
    private productCharsRepository: Repository<ProductChars>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Characteristic)
    private characteristicRepository: Repository<Characteristic>,
  ) {}

  async createAll(productId: number, productCharsDto: CreateProductCharsDto[]) {
    const newChars: ProductCharsResponseDto[] = [];
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    for (const pChar of productCharsDto) {
      const characteristic = await this.characteristicRepository.findOneBy({
        id: pChar.characteristic,
      });
      if (!characteristic) {
        throw new NotFoundException('Характеристика не найдена');
      }

      const createdChar = await this.productCharsRepository.create({
        product,
        characteristic,
        value: pChar.value,
      });

      newChars.push(createdChar);
    }
    await this.productCharsRepository.save(newChars);

    return await this.productCharsRepository.save(newChars);
  }

  async delete(id: number) {
    await this.productCharsRepository.delete(id);
  }

  async replaceAll(
    productId: number,
    replaceProductCharsDto: ReplaceProductCharsDto[],
  ) {
    await this.productCharsRepository.delete({ product: { id: productId } });

    const newChars: ProductCharsResponseDto[] = [];
    for (const characteristic of replaceProductCharsDto) {
      const createdChar = await this.productCharsRepository.create({
        product: { id: productId },
        ...characteristic,
      });
      newChars.push(createdChar);
    }

    await this.productCharsRepository.save(newChars);

    return newChars;
  }
}
