// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Role } from '../types/userRole.type';
// import { CustomerDetail } from './customerDetail.entity';
// import { PerformerDetail } from './performerDetail.entity';

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'enum', enum: Role, nullable: false, default: Role.CUSTOMER })
//   role: Role;

//   @Column({ type: 'varchar', nullable: false })
//   email: string;

//   @Column({ type: 'varchar', nullable: false, select: false })
//   password: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   // @OneToOne(() => User)
//   // @JoinColumn({ name: 'user_id' })
//   // user: User;

//   @OneToOne(() => CustomerDetail, { eager: true })
//   @JoinColumn({ name: 'customer_id' })
//   customer: CustomerDetail;

//   @OneToOne(() => PerformerDetail, { eager: true })
//   @JoinColumn({ name: 'performer_id' })
//   performer: PerformerDetail;
// }
