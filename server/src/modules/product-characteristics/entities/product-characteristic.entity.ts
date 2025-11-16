import { Characteristic } from 'src/modules/characteristics/entities/characteristic.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product_characteristics')
export class ProductChars {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.productCharacteristics)
  product: Product;

  @ManyToOne(
    () => Characteristic,
    (characteristic) => characteristic.productCharacteristics,
  )
  @JoinColumn()
  characteristic: Characteristic;

  @Column()
  value: string;
}
