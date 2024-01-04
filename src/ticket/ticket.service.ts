import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entities';
import { DataSource, Repository } from 'typeorm';
import { Concert } from 'src/concert/entities/concert.entities';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { TicketStatus } from './types/ticketStatus.type';
import { Point } from './entities/point.entities';
import { Seat } from 'src/seat/entities/seat.entities';
import { SeatStatus } from 'src/seat/types/seat.status';

@Injectable()
export class TicketService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  //티켓 예매하기
  async reservation(user, id, reservationDto): Promise<Ticket> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { count, concertDate, seatGrade } = reservationDto;
      const [grade, seatNumber] = seatGrade.split('-');

      //티켓 테이블에 데이터 넣기
      const findConcertScheduleSeatInfo = await queryRunner.manager
        .getRepository(Schedule)
        .findOne({
          relations: {
            seat: true,
          },
          where: { concertId: id, date: concertDate },
        });

      if (!findConcertScheduleSeatInfo) {
        throw new ConflictException('이미 존재하는 공연명 입니다.');
      }
      const findConcertInfo = await queryRunner.manager
        .getRepository(Concert)
        .findOne({ where: { id } });
      const findGradeByPrice = findConcertScheduleSeatInfo.seat.find(
        (e) => e.seatType === grade,
      );

      if (findGradeByPrice.price > 50000) {
        throw new BadRequestException(
          '1석 당 최대 50,000 포인트 까지만 예매가 가능합니다.',
        );
      }

      const saveReservation = {
        concertName: findConcertInfo.concertName,
        concertHallName: findConcertInfo.concertHallName,
        price: findGradeByPrice.price,
        concertDate,
        concertId: id,
        customerId: user.id,
        ticketCount: count,
        seatNum: seatGrade,
      };
      const newReservation = await queryRunner.manager
        .getRepository(Ticket)
        .save(saveReservation);

      //유저 포인트 차감하기
      const getUserPoint = await queryRunner.manager.getRepository(Point).find({
        where: { customerId: user.id },
        order: { createdAt: 'DESC' },
      });
      if (getUserPoint[0].currentPoint - findGradeByPrice.price * count < 0) {
        throw new BadRequestException('보유하신 포인트가 부족합니다.');
      }
      const newPoint = {
        currentPoint:
          getUserPoint[0].currentPoint - findGradeByPrice.price * count,
        addPoint: 0,
        minusPoint: findGradeByPrice.price * count,
        customerId: user.id,
      };

      const minusPoint = await queryRunner.manager
        .getRepository(Point)
        .save(newPoint);

      //공연 날짜에 가능한 티켓수 변경하기_ 시트 테이블 스테이터스 변경
      const findSeatData = await queryRunner.manager
        .getRepository(Seat)
        .findOne({
          where: {
            concertId: id,
            seatType: grade,
            seatNum: seatGrade,
            scheduleId: findConcertScheduleSeatInfo.id,
          },
        });
      findSeatData.status = SeatStatus.UNAVAILABLE;

      const modifySeat = await this.seatRepository.save(findSeatData);

      await queryRunner.commitTransaction();
      if (modifySeat && minusPoint && newReservation) {
        return newReservation;
      }
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //현재 예약 확인
  async currentReservation(user): Promise<Ticket[]> {
    try {
      const findUserCurrentReservation = await this.ticketRepository.find({
        where: { customerId: user.id, status: TicketStatus.ONGOING },
      });
      return findUserCurrentReservation;
    } catch (err) {
      console.log(err);
    }
  }

  //예약 취소하기__ 수정중입니다.
  async cancelReservation(user, id): Promise<object> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //취소하려는 티켓 정보 가져오기
      const findReservation = await queryRunner.manager
        .getRepository(Ticket)
        .findOne({
          where: { id },
          relations: { concert: true },
        });

      //공연 좌석수 변경하기
      const findSchedule = await queryRunner.manager
        .getRepository(Schedule)
        .findOne({
          relations: { seat: true },
          where: {
            concertId: findReservation.concertId,
            date: findReservation.concertDate,
          },
        });
      const findSeat = findSchedule.seat.find((data) => {
        return data.seatNum === findReservation.seatNum;
      });

      const koreaTime = new Date().getTime() + 60000 * 60 * 9;
      const concertTime = new Date(findSchedule.date).getTime();
      const timeUntilConcert = concertTime - koreaTime;

      if (timeUntilConcert <= 60000 * 60 * 3) {
        throw new UnauthorizedException(
          '예매 취소는 3시간 전 까지만 가능합니다.',
        );
      }
      findSeat.status = SeatStatus.AVAILABLE;
      const updateSeat = await queryRunner.manager
        .getRepository(Seat)
        .save(findSeat);

      //현재 포인트에 취소금액 추가하기.
      const findUserCurrentPoint = await queryRunner.manager
        .getRepository(Point)
        .find({
          where: { customerId: user.id },
          order: { createdAt: 'DESC' },
        });
      const cancelPrice = findReservation.price * findReservation.ticketCount;
      const updatePointData = await queryRunner.manager
        .getRepository(Point)
        .save({
          addPoint: cancelPrice,
          minusPoint: 0,
          currentPoint: findUserCurrentPoint[0].currentPoint + cancelPrice,
          customerId: user.id,
        });

      //티켓 테이블에서 데이터 삭제하기
      const deleteTicket = await queryRunner.manager
        .getRepository(Ticket)
        .delete({ id });
      await queryRunner.commitTransaction();

      if (updateSeat && updatePointData && deleteTicket) {
        return { message: '예약이 취소되었습니다.' };
      } else {
        return { message: '잠시 후 다시 시도해 주세요.' };
      }
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
