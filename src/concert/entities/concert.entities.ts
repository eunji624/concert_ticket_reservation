import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { Seat } from '../types/seat.type';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Ticket } from 'src/ticket/entities/ticket.entities';

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

  @Column({ type: 'varchar', nullable: false })
  reservationStart: string;

  @Column({ type: 'varchar', nullable: false })
  concertHallName: string;

  @OneToMany(() => Ticket, (ticket) => ticket.concert, {
    cascade: true,
  })
  ticket: Ticket[];

  @OneToMany(() => Schedule, (schedule) => schedule.concert, {
    cascade: true,
    eager: true,
  })
  schedule: Schedule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // //이거 시트 하면서 빠짐.
  // @Column({ type: 'int', nullable: false })
  // price: number;

  // //이거 시트 하면서 빠짐.
  // @Column({ type: 'enum', enum: Seat, nullable: false })
  // seatType: Seat;

  // //이거 시트 하면서 빠짐
  // @OneToMany(() => Schedule, (schedule) => schedule.concert, { cascade: true })
  // @JoinColumn()
  // schedule: Schedule[];
  // @Column({ type: 'int' })
  // scheduleId: number;

  //-------
  // @Column({ type: 'json', nullable: false })
  // availableSeat: JSON[]; //

  // @Column({ nullable: false })
  // priceByGrade: PriceByGrade[];

  // @ManyToOne(() => ConcertHall, (concertHall) => concertHall.concert)
  // @JoinColumn() // 네임 안적으면 카멜이 알아서 스네이크로 맵핑됨.
  // concertHall: ConcertHall;

  // @Column({ type: 'int' })
  // concertHallId: number;

  // @ManyToOne(() => ConcertHall, (concertHall) => concertHall.concert)
  // @JoinColumn({ name: 'concertHallId' })
  // concertHall: ConcertHall;

  // @Column({ type: 'text', nullable: false })
  // seat: string;

  // @Column({ type: 'simple-array', nullable: false }) //확장 혹은 구조변경할 일이 없으니 배열로 처리.
  // performanceDate: Date[];
}
