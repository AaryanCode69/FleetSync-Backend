import { EntityClass } from 'src/common/common.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Entity('categories')
export class Category extends EntityClass {
  @Column()
  name: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories)
  restaurant: Restaurant;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menuItems: MenuItem[];

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}
