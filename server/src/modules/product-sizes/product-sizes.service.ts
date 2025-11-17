import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from '../sizes/entities/size.entity';
import { CreateProductSizeDto } from './dto/create-product-size.dto';
import { ProductSizeResponseDto } from './dto/product-size-response.dto';
import { ProductSizesResponseDto } from './dto/product-sizes-response.dto';
import { UpdateProductSizeDto } from './dto/update-product-size.dto';
import { ProductSize } from './entities/product-sizes.entity';
import { ProductSizeToDto } from './mappers/ProductSizeToDto.mapper';

@Injectable()
export class ProductSizesService {
  constructor(
    @InjectRepository(ProductSize)
    private productSizesRepository: Repository<ProductSize>,
  ) {}

  async findByProductId(productId: number): Promise<ProductSizesResponseDto[]> {
    return this.productSizesRepository.find({
      where: { product: { id: productId } },
      relations: ['size'],
    });
  }

  async findById(id: number): Promise<ProductSizeResponseDto> {
    const productSize = await this.productSizesRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!productSize) {
      throw new NotFoundException(`Размер товара с id ${id} не найден`);
    }

    return ProductSizeToDto.toResponseDto(productSize);
  }

  async create(createProductSizeDto: CreateProductSizeDto) {
    const productSize = this.productSizesRepository.create({
      ...createProductSizeDto,
      size: { id: createProductSizeDto.sizeId },
    });
    return await this.productSizesRepository.save(productSize);
  }

  async update(id: number, updateProductSizeDto: UpdateProductSizeDto) {
    const productSize = await this.productSizesRepository.findOne({
      where: { id },
      relations: ['product', 'size'],
    });

    if (!productSize) {
      throw new NotFoundException('Размер товара не найден');
    }

    if (updateProductSizeDto.sizeId !== undefined) {
      productSize.size = { id: updateProductSizeDto.sizeId } as Size;
    }

    if (updateProductSizeDto.isAvailable !== undefined) {
      productSize.isAvailable = updateProductSizeDto.isAvailable;
    }

    if (updateProductSizeDto.quantity !== undefined) {
      productSize.quantity = updateProductSizeDto.quantity;
    }

    return await this.productSizesRepository.save(productSize);
  }

  async delete(id: number) {
    const productSize = await this.productSizesRepository.findOneBy({ id });
    if (!productSize) {
      throw new NotFoundException('Размер товара не найден');
    }

    await this.productSizesRepository.remove(productSize);
  }
}
