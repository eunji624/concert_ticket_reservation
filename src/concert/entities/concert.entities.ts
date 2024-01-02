import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Seat } from '../types/seat.type';
// import { ConcertHall } from '../../seat/entities/concertHall.entities';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { scheduled } from 'rxjs';
import { Ticket } from 'src/ticket/entities/ticket.entities';

type PriceByGrade = {
  grade: string;
  price: number;
  seat: number;
};

@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  confirm: boolean;

  @Column({ type: 'varchar', nullable: true, default: 'default@email.com' })
  performerEmail: string;

  @Column({ type: 'varchar', nullable: false })
  concertName: string;

  @Column({ type: 'varchar', nullable: false })
  concertImage: string;

  @Column({ type: 'text', nullable: false })
  concertDescription: string;

  // @Column({ type: 'simple-array', nullable: false }) //확장 혹은 구조변경할 일이 없으니 배열로 처리.
  // performanceDate: Date[];

  @Column({ type: 'varchar', nullable: false })
  reservationStart: string;

  @Column({ type: 'varchar', nullable: false })
  concertHallName: string;

  @Column({ type: 'enum', enum: Seat, nullable: false })
  seatType: Seat;

  // @Column({ nullable: fal se })
  // priceByGrade: PriceByGrade[];

  @OneToMany(() => Schedule, (schedule) => schedule.concert, { cascade: true })
  @JoinColumn()
  schedule: Schedule[];
  @Column({ type: 'int' })
  scheduleId: number;

  @OneToMany(() => Ticket, (ticket) => ticket.concert, { cascade: true })
  ticket: Ticket[];

  @Column({ type: 'int', nullable: false })
  price: number;
  // @Column({ type: 'json', nullable: false })
  // availableSeat: JSON[]; //

  // @ManyToOne(() => ConcertHall, (concertHall) => concertHall.concert)
  // @JoinColumn() // 네임 안적으면 카멜이 알아서 스네이크로 맵핑됨.
  // concertHall: ConcertHall;

  // @Column({ type: 'int' })
  // concertHallId: number;

  // @ManyToOne(() => ConcertHall, (concertHall) => concertHall.concert)
  // @JoinColumn({ name: 'concertHallId' })
  // concertHall: ConcertHall;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
