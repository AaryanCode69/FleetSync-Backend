import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { RestaurantService } from 'src/restaurant/service/restaurant.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly restaurantService: RestaurantService
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    restaurantId: string,
    userId: string
  ) {
    const restaurant =
      await this.restaurantService.getRestaurantById(restaurantId);

    if (!restaurant) {
      throw new NotFoundException('Restaurant Not Found');
    }

    if (restaurant.ownerId !== userId) {
      throw new ForbiddenException('Invalid Owner');
    }

    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      restaurant: restaurant,
    });

    return await this.categoryRepository.save(newCategory);
  }
}
