// import {
//   ConflictException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Concert } from '../concert/entities/concert.entities';
// import { DataSource, Repository } from 'typeorm';
// import { JwtService } from '@nestjs/jwt';
// import { SeatNum } from './entities/seatNum.entities';
// import { CreateSeatDto } from './dto/createSeat.dto';
// import { ConcertHall } from './entities/concertHall.entities';
// import { SeatGrade } from './entities/seatGrade.entities';

// @Injectable()
// export class SeatService {
//   constructor(
//     @InjectRepository(SeatNum)
//     private seatNumRepository: Repository<SeatNum>,
//     @InjectRepository(ConcertHall)
//     private concertHallRepository: Repository<ConcertHall>,
//     @InjectRepository(SeatGrade)
//     private seatGradeRepository: Repository<SeatGrade>,
//     private readonly jwtService: JwtService,
//     private dataSource: DataSource,
//   ) {}

//   //공연장 좌석 생성하기(공연장 등록)
//   async createSeat(createSeatDto: CreateSeatDto): Promise<string> {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();
//     try {
//       const { seatGrade, seatGradePrice, seatCountByGrade, concertHallName } =
//         createSeatDto;
//       const totalSeats = seatCountByGrade.reduce((acc, cur) => acc + cur, 0);
//       console.log('totalSeats', totalSeats);

//       //공연장 등록하기_ ConcertHall
//       const isAlreadyExist = await queryRunner.manager
//         .getRepository(ConcertHall)
//         .findOne({
//           where: { name: concertHallName },
//         });
//       if (isAlreadyExist) {
//         throw new ConflictException('이미 등록 된 공연장 입니다.');
//       }
//       const newConcertHall = await queryRunner.manager
//         .getRepository(ConcertHall)
//         .save({
//           name: concertHallName,
//           totalSeats,
//         });

//       console.log('newConcertHall 생성 오나료', newConcertHall);

//       //concertHall의 id값 가져오기
//       const concertHallId = newConcertHall.id;

//       //등급별 가격 정보 입력하기_ SeatGrade
//       for (let j = 0; j < seatGrade.length; j++) {
//         const grade = seatGrade[j];
//         const price = seatGradePrice[j];

//         const newSeatGrade = await queryRunner.manager
//           .getRepository(SeatGrade)
//           .save({
//             concertHall: newConcertHall,
//             grade,
//             price,
//           });
//         for (let i = 0; i < seatCountByGrade[j]; i++) {
//           await queryRunner.manager.getRepository(SeatNum).save({
//             concertHall: newConcertHall,
//             seatGrade: newSeatGrade,
//             concertHallId,
//             seatNum: i + 1,
//           });
//         }
//       }

//       await queryRunner.commitTransaction();
//       return `${concertHallName} 공연장 등록이 완료되었습니다. 좌석등급: ${seatGrade}, 좌석 등급별 가격: ${seatGradePrice}, 좌석 등급별 좌석 개수: ${seatCountByGrade}`;
//     } catch (err) {
//       console.log('', err);
//       await queryRunner.rollbackTransaction();
//     } finally {
//       await queryRunner.release();
//     }
//   }
// }
