import { Exclude } from 'class-transformer';
import { RefreshToken } from 'src/modules/auth/entities/token.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  middlename: string;

  @Column()
  lastname: string;

  @Column()
  phone: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  created_at: Date;
}
