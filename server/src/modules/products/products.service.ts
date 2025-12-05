import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductImage } from '../product-images/entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginatedProductsResponseDto } from './dto/paginated-products-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductsResponseDto } from './dto/products-response.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    private readonly cloudinaryService: CloudinaryService,

    private readonly categoriesService: CategoriesService,

    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
  ) {}

  // TODO: Create and load "mainImage" property
  async findAll(
    query: QueryProductsDto,
  ): Promise<PaginatedProductsResponseDto> {
    const { page, limit, category, search, sort, order } = query;

    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect(
        'product.images',
        'image',
        'image.id = (SELECT i.id FROM product_images i WHERE i."productId" = product.id ORDER BY i.id ASC LIMIT 1)',
      );

    if (category) {
      const categoryIds = await this.getCategoryAndChildrenIds(category);
      qb.andWhere('category.id IN (:...categoryIds)', { categoryIds });
    }

    if (search)
      qb.andWhere(
        'product.name ILIKE :search OR product.sku ILIKE :search OR CAST(product.price AS TEXT) ILIKE :search OR CAST(product.id AS TEXT) ILIKE :search',
        { search: `%${search}%` },
      );

    if (sort === 'category') {
      qb.orderBy(`category.name`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy(`product.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    }
    qb.skip((page - 1) * limit).take(limit);

    const [products, total] = await qb.getManyAndCount();

    const data = products.map((product) => {
      const lastCategory = this.categoriesService.getLastCategory(
        product.category,
      );
      return ProductMapper.toResponseDto(product, lastCategory);
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async getCategoryAndChildrenIds(categoryId: number): Promise<number[]> {
    const categoryRepository = this.categoryRepository;
    const category = await categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['children'],
    });
    if (!category) return [categoryId];

    const ids = [category.id];

    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        const childIds = await this.getCategoryAndChildrenIds(child.id);
        ids.push(...childIds);
      }
    }

    return ids;
  }

  async findSimilarProducts(
    categoryId: number,
    limit: number,
  ): Promise<ProductsResponseDto[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['parent', 'children'],
    });

    if (!category) throw new NotFoundException('Категория не найдена');

    const collectedProducts: Product[] = [];
    const visitedCategories = new Set<number>();

    const loadProductsFromCategory = async (cat: Category) => {
      if (visitedCategories.has(cat.id)) return;
      visitedCategories.add(cat.id);

      const products = await this.productsRepository.find({
        where: { category: { id: cat.id } },
        take: limit - collectedProducts.length,
        relations: ['images'],
        order: { id: 'DESC' },
      });

      collectedProducts.push(...products);
    };

    await loadProductsFromCategory(category);

    if (collectedProducts.length >= limit)
      return collectedProducts.slice(0, limit);

    if (category.parent) {
      const siblings = await this.categoryRepository.find({
        where: { parent: { id: category.parent.id } },
      });

      for (const sibling of siblings) {
        if (collectedProducts.length >= limit) break;
        await loadProductsFromCategory(sibling);
      }
    }

    if (collectedProducts.length >= limit)
      return collectedProducts.slice(0, limit);

    let parent = category.parent;
    while (parent && collectedProducts.length < limit) {
      await loadProductsFromCategory(parent);

      const children = await this.categoryRepository.find({
        where: { parent: { id: parent.id } },
      });

      for (const child of children) {
        if (collectedProducts.length >= limit) break;
        await loadProductsFromCategory(child);
      }

      parent = parent.parent;
    }

    if (collectedProducts.length < limit) {
      const rootCategories = await this.categoryRepository.find({
        where: { parent: IsNull() },
      });

      for (const rootCat of rootCategories) {
        if (collectedProducts.length >= limit) break;
        await loadProductsFromCategory(rootCat);
      }
    }

    if (collectedProducts.length < limit) {
      const rest = await this.productsRepository.find({
        take: limit - collectedProducts.length,
        order: { id: 'DESC' },
        relations: ['images'],
      });
      collectedProducts.push(...rest);
    }

    const products = collectedProducts.slice(0, limit);

    return products.map((product) => ProductMapper.toResponseDto(product));
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: [
        'sizes.size',
        'images',
        'productCharacteristics.characteristic',
        'category',
      ],
    });
    if (!product) {
      throw new NotFoundException(`Товар не найден`);
    }

    return ProductMapper.toShortResponseDto(product);
  }

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<ProductResponseDto> {
    const uploadedImages: ProductImage[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const result = await this.cloudinaryService.uploadImage(file);

        const imageEntity = this.productImagesRepository.create({
          name: `${Date.now()}-${file.originalname}`,
          url: result.secure_url,
          publicId: result.public_id,
        });

        uploadedImages.push(imageEntity);
      }
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      category: { id: createProductDto.categoryId },
      images: uploadedImages,
    });

    const savedProduct = await this.productsRepository.save(product);

    return savedProduct;
  }

  // TODO: Update images
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'images'],
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    if (updateProductDto.name !== undefined) {
      product.name = updateProductDto.name;
    }

    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description;
    }

    if (updateProductDto.care !== undefined) {
      product.care = updateProductDto.care;
    }

    if (updateProductDto.price !== undefined) {
      product.price = updateProductDto.price;
    }

    if (updateProductDto.discount !== undefined) {
      product.discount = updateProductDto.discount;
    }

    if (updateProductDto.isActive !== undefined) {
      product.isActive = updateProductDto.isActive;
    }

    if (updateProductDto.categoryId !== undefined) {
      product.category = { id: updateProductDto.categoryId } as Category;
    }

    const updated = await this.productsRepository.save(product);

    return updated;
  }

  async delete(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    await this.productsRepository.delete(id);
  }

  async incrementSold(productId: number, quantity = 1): Promise<void> {
    const result = await this.productsRepository.increment(
      { id: productId },
      'sold',
      quantity,
    );

    if (result.affected === 0) {
      throw new NotFoundException('Товар не найден');
    }
  }
}
