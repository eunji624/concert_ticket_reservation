import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
}
