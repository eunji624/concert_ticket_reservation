import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SeatGrade } from './seatGrade.entities';

@Entity()
export class SeatNum {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: 'int', nullable: false })
  // concertHallId: number;

  // @Column({ type: 'varchar', nullable: false })
  // concertHallName: string;

  // @Column({ type: 'int', nullable: false })
  // seatGradeId: number;

  @Column({ type: 'int', nullable: false })
  seatNum: number;

  // @ManyToOne(() => ConcertHall, (concertHall) => concertHall.seatNum)
  // @JoinColumn()
  // concertHall: ConcertHall; //날짜가 다르면?

  // @Column({ type: 'int' })
  // concertHallId: number;

  @ManyToOne(() => SeatGrade, (seatGrade) => seatGrade.seatNum)
  @JoinColumn()
  seatGrade: SeatGrade;

  @Column({ type: 'int' })
  seatGradeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
