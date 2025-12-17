import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findByPath(slugs: string[]): Promise<CategoryResponseDto> {
    let parent: CategoryResponseDto | null = null;

    for (const slug of slugs) {
      const whereCondition: any = { slug };

      if (parent === null) {
        whereCondition.parent = null;
      } else {
        whereCondition.parent = { id: parent.id };
      }

      const category = await this.categoryRepository.findOne({
        where: whereCondition,
        relations: ['parent'],
      });

      if (!category) {
        throw new NotFoundException(`Категория со slug "${slug}" не найдена`);
      }

      parent = category;
    }

    return parent!;
  }

  async getRootCategories() {
    const roots = await this.categoryRepository.find({
      where: { parent: IsNull() },
      relations: ['children'],
    });
    return roots;
  }

  async loadChildrenRecursively(category: Category): Promise<Category> {
    category.children = await this.categoryRepository.find({
      where: { parent: category },
      relations: ['children'],
    });
    for (const child of category.children) {
      await this.loadChildrenRecursively(child);
    }
    return category;
  }

  async getFullHierarchy(): Promise<CategoryResponseDto[]> {
    const roots = await this.getRootCategories();

    for (const root of roots) {
      await this.loadChildrenRecursively(root);
    }

    return roots;
  }

  async getCategoryHierarchy(
    categoryId: number,
  ): Promise<CategoryResponseDto[]> {
    const hierarchy: Category[] = [];
    let currentCategory = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['parent'],
    });

    if (!currentCategory) {
      throw new NotFoundException('Категория не найдена');
    }

    while (currentCategory) {
      hierarchy.unshift(currentCategory);
      if (currentCategory.parent) {
        currentCategory = await this.categoryRepository.findOne({
          where: { id: currentCategory.parent.id },
          relations: ['parent'],
        });
      } else {
        break;
      }
    }

    return hierarchy;
  }

  getLastCategory(category: Category): Category {
    if (category.children && category.children.length > 0) {
      return this.getLastCategory(
        category.children[category.children.length - 1],
      );
    }

    return category;
  }

  async findById(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  // Find all categories without children
  async getPlainCategories() {
    const categories = await this.categoryRepository.find({
      relations: ['parent'],
    });
    return categories;
  }

  async create(
    categoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto | undefined> {
    const category = this.categoryRepository.create(categoryDto);
    if (categoryDto.parentId && typeof categoryDto.parentId === 'number') {
      category.parent = { id: categoryDto.parentId } as Category;
    }
    const createdCategory = await this.categoryRepository.save(category);
    const categoryResponse = await this.categoryRepository.findOne({
      where: { id: createdCategory.id },
      relations: ['parent'],
    });
    if (categoryResponse) {
      return categoryResponse;
    }
  }

  async update(categoryId: number, updateCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Категория на найдена');
    }

    category.parent = updateCategoryDto.parentId
      ? ({ id: updateCategoryDto.parentId } as Category)
      : null;

    category.name = updateCategoryDto.name;
    const updatedCategory = await this.categoryRepository.save(category);
    const categoryResponse = await this.categoryRepository.findOne({
      where: { id: updatedCategory.id },
      relations: ['parent'],
    });
    if (categoryResponse) {
      return categoryResponse;
    }
  }

  async delete(id: number) {
    return await this.categoryRepository.delete({ id });
  }
}
