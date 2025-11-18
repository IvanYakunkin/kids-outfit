import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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

  async getFullHierarchy() {
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

  async findById(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async create(categoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const category = this.categoryRepository.create(categoryDto);
    return await this.categoryRepository.save(category);
  }

  async update(categoryId: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Категория на найдена');
    }

    category.name = updateCategoryDto.name;
    category.parent = updateCategoryDto.parent;

    return await this.categoryRepository.save(category);
  }

  async delete(id: number) {
    return await this.categoryRepository.delete({ id });
  }
}
