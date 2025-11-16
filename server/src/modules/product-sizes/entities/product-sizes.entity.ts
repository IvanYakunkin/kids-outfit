import { Product } from 'src/modules/products/entities/product.entity';
import { Size } from 'src/modules/sizes/entities/size.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_sizes')
export class ProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.sizes)
  product: Product;

  @ManyToOne(() => Size, (size) => size.productSizes, { eager: true })
  size: Size;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 1 })
  quantity: number;
}
