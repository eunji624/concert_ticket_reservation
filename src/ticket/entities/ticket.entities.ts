import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketStatus } from '../types/ticketStatus.type';
import { Customer } from 'src/user/entities/customer.entity';
import { Concert } from 'src/concert/entities/concert.entities';
import { Point } from './point.entities';

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

  @Column({ type: 'int', nullable: false })
  seatNum: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  count: number;

  @Column({ type: 'varchar', nullable: false })
  concertDate: string;

  @Column({ type: 'int', nullable: false })
  ticketCount: number;

  // TODO userTickets테이블과 1: N 설정.
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

  //콘서트 아이디 값은 유저가 티켓을 예매해서 데이터를 넣을때 콘서트 아이디 값, 날짜 집어넣기.
  // @Column({ type: 'int', nullable: false })
  // concertId: number;
}
