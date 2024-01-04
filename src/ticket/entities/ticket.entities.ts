import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketStatus } from '../types/ticketStatus.type';
import { Customer } from 'src/user/entities/customer.entity';
import { Concert } from 'src/concert/entities/concert.entities';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, default: TicketStatus.ONGOING })
  status: TicketStatus;

  @Column({ type: 'varchar', nullable: false })
  concertName: string;

  @Column({ type: 'varchar', nullable: false })
  concertHallName: string;

  @Column({ type: 'varchar', nullable: false })
  seatNum: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'varchar', nullable: false })
  concertDate: string;

  @Column({ type: 'int', nullable: false })
  ticketCount: number;

  @ManyToOne(() => Customer, (customer) => customer.ticket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Customer;
  @Column({ type: 'int' })
  customerId: number;

  @ManyToOne(() => Concert, (concert) => concert.ticket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  concert: Concert;
  @Column({ type: 'int' })
  concertId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
