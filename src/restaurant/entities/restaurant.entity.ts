import type { Point } from 'geojson';
import { EntityClass } from 'src/common/common.entity';
import { Category } from 'src/menu-item/entities/category.entity';
import { MenuItem } from 'src/menu-item/entities/menu-item.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity('restaurants')
export class Restaurant extends EntityClass {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  address: string;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column()
  pincode: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column({ type: 'numeric', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ type: 'int', name: 'rating_count', default: 0 })
  ratingCount: number;

  @Column({ name: 'cuisine_type', type: 'text', array: true })
  cuisineType: string[];

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant, {
    cascade: true,
  })
  menuItems: MenuItem[];

  @OneToMany(() => Category, (category) => category.restaurant)
  categories: Category[];
}
