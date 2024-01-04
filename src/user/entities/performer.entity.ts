import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../types/userRole.type';

@Entity()
export class Performer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Role, nullable: false })
  role: Role.PERFORMER;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  production: string;

  @Column({ type: 'varchar', nullable: false })
  position: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  contact_person: string;

  @Column({ type: 'varchar', nullable: false })
  contact_company: string;

  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  updated_At: Date;
}
