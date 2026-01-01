import { EntityClass } from 'src/common/common.entity';
import { Order } from 'src/order/entities/Order.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

export enum PaymentMode {
  UPI = 'UPI',
  CARD = 'CARD',
  NET_BANKING = 'NET_BANKING',
  COD = 'COD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity('payments')
export class Payment extends EntityClass {
  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMode,
    name: 'payment_mode',
    default: PaymentMode.COD,
  })
  paymentMode: PaymentMode;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    name: 'payment_status',
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
