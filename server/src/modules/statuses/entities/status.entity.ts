import { Order } from 'src/modules/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('statuses')
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Order, (order) => order.status)
  orders: Order[];

  @Column()
  name: string;
}
