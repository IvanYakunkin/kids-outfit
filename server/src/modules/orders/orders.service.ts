import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSize } from '../product-sizes/entities/product-sizes.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { PaginatedOrdersDto } from './dto/paginated-orders.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { UpdateOrderResponseDto } from './dto/update-order-response.dto';
import { Order } from './entities/order.entity';
import { mapAllOrders } from './mappers/mapAllOrders.mapper';
import { mapOrderToDto } from './mappers/mapOrderToDto.mapper';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(Product)
    private productsRepo: Repository<Product>,

    @InjectRepository(ProductSize)
    private productSizeRepo: Repository<ProductSize>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const activeOrdersCount = await this.ordersRepository.count({
      where: {
        user: { id: userId },
        status: { id: Number(process.env.ACTIVE_ORDER_STATUS_ID) || 1 },
      },
    });

    if (activeOrdersCount >= Number(process.env.ACTIVE_ORDER_LIMIT)) {
      throw new ForbiddenException('Достигнут лимит активных заказов');
    }

    const orderProducts = await Promise.all(
      createOrderDto.products.map(async (p) => {
        const product = await this.productsRepo.findOneBy({
          id: p.productId,
        });
        const productSize = await this.productSizeRepo.findOneBy({
          id: p.productSizeId,
        });

        if (!product)
          throw new NotFoundException(`Товар ${p.productId} не найден`);
        if (!productSize || !productSize.isAvailable)
          throw new NotFoundException(`Размер ${p.productSizeId} не найден`);
        if (p.quantity > productSize.quantity) {
          throw new NotFoundException(
            `Товар ${product.name} в количестве ${p.quantity} отсутствует`,
          );
        }

        await this.productsRepo.increment(
          { id: product.id },
          'sold',
          p.quantity,
        );

        await this.productSizeRepo.decrement(
          { id: productSize.id },
          'quantity',
          p.quantity,
        );

        return {
          product,
          productSize,
          quantity: p.quantity,
          price: product.price,
        };
      }),
    );

    const total = orderProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = this.ordersRepository.create({
      user,
      address: createOrderDto.address,
      total,
      products: orderProducts,
      status: { id: 1 },
    });

    await this.ordersRepository.save(order);
  }

  async findOrderById(id: number): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: [
        'user',
        'status',
        'products',
        'products.productSize',
        'products.productSize.product',
        'products.productSize.product.images',
      ],
    });
    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    return mapOrderToDto(order);
  }

  async findAll(query: QueryOrdersDto): Promise<PaginatedOrdersDto> {
    const {
      page = 1,
      limit = 20,
      statusId,
      userId,
      sort = 'DESC',
      search,
    } = query;

    const qb = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.status', 'status')
      .orderBy('order.createdAt', sort)
      .skip((page - 1) * limit)
      .take(limit);

    if (statusId) {
      qb.andWhere('order.statusId = :statusId', { statusId });
    }

    if (userId) {
      qb.andWhere('order.userId = :userId', { userId });
    }

    if (search) {
      qb.andWhere(
        `(
      CONCAT(user.firstname, ' ', user.middlename, ' ', user.lastname) ILIKE :search
      OR order.id::text ILIKE :search
    )`,
        { search: `%${search}%` },
      );
    }

    const [orders, total] = await qb.getManyAndCount();
    return {
      data: orders.map(mapAllOrders),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOrdersByUser(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: [
        'status',
        'user',
        'products',
        'products.productSize',
        'products.productSize.product',
        'products.productSize.product.images',
      ],
      order: {
        createdAt: 'DESC',
      },
    });

    return orders.map(mapOrderToDto);
  }

  async update(id, updateOrderDto): Promise<UpdateOrderResponseDto> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    if (updateOrderDto.statusId) {
      order.status = updateOrderDto.statusId;
    }

    const savedOrder = await this.ordersRepository.save(order);
    return {
      id: savedOrder.id,
      address: savedOrder.address,
      status: savedOrder.status.id,
      total: savedOrder.total.toString(),
      createdAt: savedOrder.createdAt,
    };
  }
}
