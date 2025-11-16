import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSize } from '../product-sizes/entities/product-sizes.entity';
import { CartResponseDto } from './dto/cart-response.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { mapCart } from './mappers/cartToResponse.mapper';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(ProductSize)
    private productSizeRepository: Repository<ProductSize>,
  ) {}

  async findProducts(userId: number): Promise<CartResponseDto[]> {
    const cart = await this.cartRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: [
        'productSize',
        'productSize.product',
        'productSize.product.images',
      ],
    });

    if (!cart) {
      throw new NotFoundException('Пользователь не найден!');
    }

    return cart.map(mapCart);
  }

  async addProduct(userId: number, createCartDto: CreateCartDto) {
    const productSize = await this.productSizeRepository.findOne({
      where: { id: createCartDto.productSizeId },
      relations: ['product', 'product.images'],
    });
    if (!productSize) {
      throw new NotFoundException('Товар с таким размером не найден');
    }

    const existingProduct = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        productSize: { id: createCartDto.productSizeId },
      },
    });

    // TODO: Possibly, increase the quantity if the product is already in the cart
    if (existingProduct) {
      throw new ConflictException('Выбранный товар уже находится в корзине');
    }

    const cartProduct = this.cartRepository.create({
      user: { id: userId },
      productSize,
      quantity: createCartDto.quantity,
    });

    const saved = await this.cartRepository.save(cartProduct);
    return mapCart(saved);
  }

  async deleteProduct(userId: number, productSizeId: number) {
    const productSize = await this.cartRepository.findOne({
      where: { user: { id: userId }, productSize: { id: productSizeId } },
      relations: [
        'productSize',
        'productSize.product',
        'productSize.product.images',
      ],
    });
    if (!productSize) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    const saved = await this.cartRepository.remove(productSize);
    return mapCart(saved);
  }

  async updateQuantity(
    userId: number,
    cartProductId: number,
    updateCartDto: UpdateCartDto,
  ) {
    const cartItem = await this.cartRepository.findOne({
      where: { productSize: { id: cartProductId }, user: { id: userId } },
      relations: [
        'productSize',
        'productSize.product',
        'productSize.product.images',
      ],
    });

    if (!cartItem) {
      throw new NotFoundException('Товар не найден в корзине');
    }
    if (updateCartDto.quantity) {
      cartItem.quantity = updateCartDto.quantity;
    }
    const saved = await this.cartRepository.save(cartItem);
    return mapCart(saved);
  }
}
