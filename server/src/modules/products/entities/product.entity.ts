import { Category } from 'src/modules/categories/entities/category.entity';
import { ProductChars } from 'src/modules/product-characteristics/entities/product-characteristic.entity';
import { ProductImage } from 'src/modules/product-images/entities/product-image.entity';
import { ProductSize } from 'src/modules/product-sizes/entities/product-sizes.entity';
import { slugify } from 'transliteration';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ unique: true })
  sku: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ProductSize, (productSize) => productSize.product, {
    onDelete: 'CASCADE',
  })
  sizes?: ProductSize[];

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  care?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  sold: number;

  @Column({ nullable: true })
  discount?: number;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images?: ProductImage[];

  @OneToMany(() => ProductChars, (pc) => pc.product, { cascade: true })
  productCharacteristics?: ProductChars[];

  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  generateSku() {
    this.sku = Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name).toLowerCase();
    }
  }
}
