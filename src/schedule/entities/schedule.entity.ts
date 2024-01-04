import { Concert } from 'src/concert/entities/concert.entities';
import { Seat } from 'src/seat/entities/seat.entities';
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

  @ManyToOne(() => Concert, (concert) => concert.schedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  concert: Concert;
  @Column({ type: 'int' })
  concertId: number;

  @OneToMany(() => Seat, (seat) => seat.schedule, { cascade: true })
  seat: Seat[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
