import { EntityClass } from 'src/common/common.entity';
import { MenuItem } from 'src/menu-item/entities/menu-item.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './Order.entity';

@Entity('order_item')
export class OrderItem extends EntityClass {
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  amountAtPurchase: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => MenuItem)
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;
}
