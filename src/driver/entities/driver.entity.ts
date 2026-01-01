import type { Point } from 'geojson';
import { EntityClass } from 'src/common/common.entity';
import { Order } from 'src/order/entities/Order.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum DriverStatus {
  IDLE = 'IDLE',
  BUSY = 'BUSY',
}

@Entity('drivers')
export class Driver extends EntityClass {
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'is_online', nullable: false, default: false })
  isOnline: boolean;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    name: 'driver_status',
    default: DriverStatus.IDLE,
  })
  driverStatus: DriverStatus;

  @OneToMany(() => Order, (order) => order.driver)
  orders: Order[];

  @Column({ nullable: false, name: 'vehicle_type' })
  vehicleType: string;

  @Column({ name: 'vehicle_number', nullable: true })
  vehicleNumber: string;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
    name: 'current_location',
  })
  currentLocation: Point;
}
