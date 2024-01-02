import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { User } from './user.entity';
import { Role } from '../types/userRole.type';
import { Ticket } from 'src/ticket/entities/ticket.entities';
import { Point } from 'src/ticket/entities/point.entities';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Role, nullable: false })
  role: Role.CUSTOMER;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'date', nullable: false })
  birth: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.customer, { cascade: true })
  // @JoinColumn()
  ticket: Ticket[];
  // @Column({ type: 'int' })
  // ticketId: number;

  @OneToMany(() => Point, (point) => point.customer, { cascade: true })
  // @JoinColumn()
  point: Point[];
  // @Column({ type: 'int' })
  // pointId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
