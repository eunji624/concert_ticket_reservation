import { Schedule } from 'src/schedule/entities/schedule.entity';
import { SeatStatus } from '../types/seat.status';
import { SeatType } from '../types/seat.type';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SeatType, nullable: false })
  seatType: SeatType;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'enum', enum: SeatStatus, nullable: false })
  status: SeatStatus;

  @Column({ type: 'varchar', nullable: false })
  seatNum: string;

  @Column({ type: 'int', nullable: false })
  concertId: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.seat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  schedule: Schedule;
  @Column({ type: 'int' })
  scheduleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
