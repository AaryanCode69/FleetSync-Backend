import { Exclude } from 'class-transformer';
import type { Point } from 'geojson';
import { EntityClass } from 'src/common/common.entity';
import { Order } from 'src/order/entities/Order.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

@Entity('user')
export class User extends EntityClass {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];
}
