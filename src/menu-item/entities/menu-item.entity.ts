import { EntityClass } from 'src/common/common.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity('menu_items')
export class MenuItem extends EntityClass {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false, name: 'is_veg' })
  isVeg: boolean;

  @Column({ nullable: false, default: true, name: 'is_available' })
  isAvailable: boolean;

  @Column({ nullable: false, name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'decimal', nullable: false, scale: 2, precision: 10 })
  price: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuItems)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne(() => Category, (category) => category.menuItems)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
