import { Concert } from 'src/concert/entities/concert.entities';
import { SeatGrade } from 'src/seat/entities/seatGrade.entities';
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
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  date: string;

  @Column({ type: 'int', nullable: false })
  totalSeat: number;

  @OneToMany(() => SeatGrade, (seatGrade) => seatGrade.schedule)
  @JoinColumn()
  seatGrade: SeatGrade[];
  @Column({ type: 'int', nullable: true })
  seatGradeId: number;

  @ManyToOne(() => Concert, (concert) => concert.schedule, {
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
