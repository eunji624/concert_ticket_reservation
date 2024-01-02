// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Seat } from '../../concert/types/seat.type';
// import { Concert } from '../../concert/entities/concert.entities';
// import { SeatNum } from './seatNum.entities';
// import { SeatGrade } from './seatGrade.entities';

// @Entity()
// export class ConcertHall {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', nullable: false })
//   name: string;

//   @Column({ type: 'int', nullable: false })
//   totalSeats: number;

//   @OneToMany(() => Concert, (concert) => concert.concertHall)
//   concert: Concert[];

//   @OneToMany(() => SeatNum, (seatNum) => seatNum.concertHall, { cascade: true })
//   seatNum: SeatNum[];

//   @OneToMany(() => SeatGrade, (seatGrade) => seatGrade.concertHall)
//   @JoinColumn()
//   seatGrade: SeatGrade[];

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
