import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Товар, к которому относится изображение (связь ManyToOne)',
    type: Number,
    example: 12,
  })
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ApiProperty({
    example: 'default.jpg',
    description: 'Имя файла изображения товара',
    default: 'default.jpg',
  })
  @Column({ default: 'default.jpg' })
  imageName: string;
}
