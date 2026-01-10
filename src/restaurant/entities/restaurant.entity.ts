import type { Point } from 'geojson';
import { EntityClass } from 'src/common/common.entity';
import { Category } from 'src/menu-item/entities/category.entity';
import { MenuItem } from 'src/menu-item/entities/menu-item.entity';
import { Order } from 'src/order/entities/Order.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Review } from './review.entity';
import { User } from 'src/user/entities/user.entity';

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
    nullable: false,
  })
  location: Point;

  @Column({ name: 'is_active', default: false })
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

  @OneToMany(() => Category, (category) => category.restaurant, {
    cascade: true,
  })
  categories: Category[];

  @OneToMany(() => Order, (order) => order.restaurant, { cascade: true })
  orders: Order[];

  @OneToMany(() => Review, (review) => review.restaurant, { cascade: true })
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}
