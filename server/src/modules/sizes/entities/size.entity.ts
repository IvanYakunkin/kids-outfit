import { ApiProperty } from '@nestjs/swagger';
import { ProductSize } from 'src/modules/product-sizes/entities/product-sizes.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sizes')
export class Size {
  @ApiProperty({ description: 'ID размера' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Значение размера', example: 144 })
  @Column()
  name: string;

  @ApiProperty({ description: 'Размеры товара', type: ProductSize })
  @OneToMany(() => ProductSize, (productSize) => productSize.size)
  productSizes: ProductSize[];
}
