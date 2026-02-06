import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from '../entities/menu-item.entity';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { CreateMenuItemDto } from '../dto/create-menuitem.dto';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem) private menuItemReposity: Repository<MenuItem>,
    private readonly categoryService: CategoryService
  ) {}

  async addMenuItem(
    userId: string,
    newMenuItem: CreateMenuItemDto,
    categoryId: string
  ) {
    const currCategory = await this.categoryService.getCategoryById(categoryId);

    if (currCategory == null) {
      throw new NotFoundException('Authentication Failed');
    }

    if (currCategory.restaurant.ownerId !== userId) {
      throw new ForbiddenException('Action Not Allowed');
    }

    const menuItem = this.menuItemReposity.create({
      ...newMenuItem,
      category: currCategory,
      restaurant: currCategory.restaurant,
    });

    return await this.menuItemReposity.save(menuItem);
  }
}
