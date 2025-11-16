import { Order } from 'src/modules/orders/entities/order.entity';
import { ProductSize } from 'src/modules/product-sizes/entities/product-sizes.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order_products')
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.products)
  order: Order;

  @ManyToOne(() => ProductSize)
  productSize: ProductSize;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ default: 1 })
  quantity: number;

  @Column('decimal')
  price: number;
}
