import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-array', nullable: false })
  concertId: number[];
}
