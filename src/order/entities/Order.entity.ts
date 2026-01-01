import { EntityClass } from 'src/common/common.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { OrderItem } from './OrderItem.entity';
import { User } from 'src/user/entities/user.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import type { Point } from 'geojson';

export enum Status {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT FOR DELIVERY',
  DELIVERED = 'DELIVERED',
}

@Entity('orders')
export class Order extends EntityClass {
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.order)
  restaurant: Restaurant;

  @Column({ name: 'order_status', default: Status.PENDING })
  orderStatus: Status;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
    name: 'delivery_location',
  })
  deliveryLocation: Point;

  @Column({ name: 'delivery_address', nullable: false })
  deliveryAddress: string;
}
