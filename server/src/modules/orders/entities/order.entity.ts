import { OrderProduct } from 'src/modules/order-products/entities/orderProduct.entity';
import { Status } from 'src/modules/statuses/entities/status.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  address: string;

  @OneToMany(() => OrderProduct, (product) => product.order, { cascade: true })
  products: OrderProduct[];

  @ManyToOne(() => Status, (status) => status.orders)
  status: Status;

  @Column({ type: 'decimal' })
  total: number;

  @CreateDateColumn()
  createdAt: Date;
}
