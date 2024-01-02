import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { SeatNum } from './seatNum.entities';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Entity()
export class SeatGrade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  grade: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @ManyToOne((type) => Schedule, (schedule) => schedule.seatGrade)
  @JoinColumn()
  schedule: Schedule;

  @Column({ type: 'int' })
  scheduleId: number;

  @OneToMany(() => SeatNum, (seatNum) => seatNum.seatGrade)
  seatNum: SeatNum[];

  // @ManyToOne((type) => ConcertHall, (concertHall) => concertHall.seatGrade)
  // @JoinColumn({ name: 'concertHallId' })
  // concertHall: ConcertHall;
  // @Column({ type: 'int' })
  // concertHallId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
