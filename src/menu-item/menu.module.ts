import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, MenuItem]), RestaurantModule],
  exports: [TypeOrmModule],
})
export class MenuModule {}
