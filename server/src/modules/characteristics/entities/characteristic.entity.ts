import { ProductChars } from 'src/modules/product-characteristics/entities/product-characteristic.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('characteristics')
export class Characteristic {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ProductChars, (pc) => pc.characteristic)
  productCharacteristics: ProductChars[];

  @Column()
  value: string;
}
