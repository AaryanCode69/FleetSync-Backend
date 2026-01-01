import { EntityClass } from 'src/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Restaurant } from './restaurant.entity';

@Entity('reviews')
export class Review extends EntityClass {
  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
