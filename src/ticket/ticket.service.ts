import {
  BadRequestException,
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

@Injectable()
export class TicketService {
  constructor(
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  //티켓 예매하기
  async reservation(user, id, reservationDto): Promise<Ticket> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { count, concertDate } = reservationDto;
      console.log('날짜 확인', concertDate);
      const newDate = concertDate.substr(0, 10);

      //티켓 테이블에 데이터 넣기
      const findConcertInfo = await queryRunner.manager
        .getRepository(Concert)
        .findOne({
          relations: {
            schedule: true,
          },
          where: { id },
        });
      if (findConcertInfo.price > 50000) {
        throw new BadRequestException(
          '1석 당 최대 50,000 포인트 까지만 예매가 가능합니다.',
        );
      }
      const saveReservation = {
        concertName: findConcertInfo.concertName,
        concertHallName: findConcertInfo.concertHallName,
        price: findConcertInfo.price,
        concertDate,
        concertId: id,
        customerId: user.id,
        ticketCount: count,
      };
      console.log('saveReservation', saveReservation);
      const newReservation = await queryRunner.manager
        .getRepository(Ticket)
        .save(saveReservation);

      //유저 포인트 차감하기
      const getUserPoint = await queryRunner.manager.getRepository(Point).find({
        where: { customerId: user.id },
        order: { createdAt: 'DESC' },
      });
      console.log('getUserPoint', getUserPoint);
      if (getUserPoint[0].currentPoint - findConcertInfo.price * count < 0) {
        throw new BadRequestException('보유하신 포인트가 부족합니다.');
      }
      const newPoint = {
        currentPoint:
          getUserPoint[0].currentPoint - findConcertInfo.price * count,
        addPoint: 0,
        minusPoint: findConcertInfo.price * count,
        customerId: user.id,
      };

      const minusPoint = await queryRunner.manager
        .getRepository(Point)
        .save(newPoint);

      //공연 날짜에 가능한 티켓수 변경하기
      const findScheduleData = await queryRunner.manager
        .getRepository(Schedule)
        .findOne({
          where: { concertId: id, date: concertDate },
        });
      findScheduleData.totalSeat = findScheduleData.totalSeat - count;
      const modifyScheduleSeat =
        await this.scheduleRepository.save(findScheduleData);

      await queryRunner.commitTransaction();
      if (modifyScheduleSeat && newReservation && minusPoint) {
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
      console.log('findUserCurrentReservation', findUserCurrentReservation);
      return findUserCurrentReservation;
    } catch (err) {
      console.log(err);
    }
  }

  //예약 취소하기
  async cancelReservation(user, id): Promise<object> {
    try {
      const findReservation = await this.ticketRepository.findOne({
        where: { id },
        // relations: { concert: true},
      });
      console.log('findReservation 티켓', findReservation);
      //eger or laze relation 으로 join으로 데이터 가져올것인가? _ 그럼 concert단 서비스 로직 수정해야함.

      //공연 좌석수 변경하기
      const findSchedule = await this.scheduleRepository.findOne({
        where: {
          concertId: findReservation.concertId,
          date: findReservation.concertDate,
        },
      });
      const koreaTime = new Date().getTime() + 60000 * 60 * 9;
      const concertTime = new Date(findSchedule.date).getTime();
      const timeUntilConcert = concertTime - koreaTime;
      console.log('한국시간', koreaTime);
      console.log('콘서트 시작시간', concertTime);
      console.log('시간차', timeUntilConcert, 60000 * 60 * 3);

      if (timeUntilConcert <= 60000 * 60 * 3) {
        throw new UnauthorizedException(
          '예매 취소는 3시간 전 까지만 가능합니다.',
        );
      }
      findSchedule.totalSeat =
        findSchedule.totalSeat + findReservation.ticketCount;
      const updateSchedule = await this.scheduleRepository.save(findSchedule);
      console.log('updateSchedule 스케줄변경', updateSchedule);

      //현재 포인트에 취소금액 추가하기.
      const findUserCurrentPoint = await this.pointRepository.find({
        where: { customerId: user.id },
        order: { createdAt: 'DESC' },
      });
      console.log('findUserCurrentPoint', findUserCurrentPoint[0]);
      const cancelPrice = findReservation.price * findReservation.ticketCount;
      console.log('취소될 가격', cancelPrice);
      const updatePointData = await this.pointRepository.save({
        addPoint: cancelPrice,
        minusPoint: 0,
        currentPoint: findUserCurrentPoint[0].currentPoint + cancelPrice,
        customerId: user.id,
      });
      console.log('updatePointData 총포인트 돌려놓기', updatePointData);

      //티켓 테이블에서 데이터 삭제하기
      const deleteTicket = await this.ticketRepository.delete({ id });
      if (updateSchedule && updatePointData && deleteTicket) {
        return { message: '예약이 취소되었습니다.' };
      } else {
        return { message: '잠시 후 다시 시도해 주세요.' };
      }
      //트렌젝션 처리하기.
    } catch (err) {
      console.log(err);
    }
  }
}
