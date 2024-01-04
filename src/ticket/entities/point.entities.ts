import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from 'src/user/entities/customer.entity';

@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  addPoint: number;

  @Column({ type: 'int', nullable: false })
  minusPoint: number;

  @Column({ type: 'int', nullable: false })
  currentPoint: number;

  @ManyToOne(() => Customer, (customer) => customer.point, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Customer;
  @Column({ type: 'int' })
  customerId: number;

  //결제 시점 시간 정보
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
