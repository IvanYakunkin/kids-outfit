import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
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
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
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

  async createAll(
    productId: number,
    createProductSizeDto: CreateProductSizeDto[],
  ) {
    const productSizes: ProductSizeResponseDto[] = [];
    for (const pSize of createProductSizeDto) {
      const createdPSize = this.productSizesRepository.create({
        size: { id: pSize.sizeId },
        quantity: pSize.quantity,
        product: { id: productId },
      });
      productSizes.push(ProductSizeToDto.toResponseDto(createdPSize));
    }
    await this.productSizesRepository.save(productSizes);

    return productSizes;
  }

  // If ID is not undefined - need to update quantity. Otherwise - create a new pSize
  async update(
    productId: number,
    updateProductSizeDto: UpdateProductSizeDto[],
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['sizes'],
    });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    for (const size of updateProductSizeDto) {
      if (size.id && product.sizes) {
        const existingSize = product.sizes.find((p) => p.id === size.id);
        if (existingSize && size.quantity != null) {
          existingSize.quantity = size.quantity;
          existingSize.product = product;
          await this.productSizesRepository.save(existingSize);
        }
      } else {
        const newSize = this.productSizesRepository.create({
          size: { id: size.sizeId },
          quantity: size.quantity,
          product: { id: productId },
        });
        await this.productSizesRepository.save(newSize);
      }
    }

    const updatedSizes = await this.productSizesRepository.find({
      where: { product: { id: productId } },
      relations: ['size', 'product'],
    });

    return updatedSizes.map((pSize) => ProductSizeToDto.toResponseDto(pSize));
  }

  async delete(id: number) {
    const productSize = await this.productSizesRepository.findOneBy({ id });
    if (!productSize) {
      throw new NotFoundException('Размер товара не найден');
    }

    await this.productSizesRepository.remove(productSize);
  }
}
