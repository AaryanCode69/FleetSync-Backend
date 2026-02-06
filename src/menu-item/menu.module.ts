import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { MenuItemController } from './controller/menu-item.controller';
import { MenuItemService } from './service/menu-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, MenuItem]), RestaurantModule],
  exports: [TypeOrmModule],
  controllers: [CategoryController, MenuItemController],
  providers: [CategoryService, MenuItemService],
})
export class MenuModule {}
