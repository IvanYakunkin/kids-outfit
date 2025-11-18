import { Expose, Transform } from 'class-transformer';
import { ProductSize } from 'src/modules/product-sizes/entities/product-sizes.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => ProductSize, { eager: true })
  productSize: ProductSize;

  @Column({ default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @Transform(({ obj }) => ({
    id: obj.productSize.product.id,
    name: obj.productSize.product.name,
    price: parseFloat(obj.productSize.product.price),
    discount: obj.productSize.product.discount,
    image: obj.productSize.product.image,
  }))
  product: Product;
}
