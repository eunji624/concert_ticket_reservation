import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from '../concert/entities/concert.entities';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from './entities/seat.entities';
import { SeatStatus } from './types/seat.status';
import { PriceByGrade } from './types/priceByGrade.type';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async createSeat(schedule, concertId, priceByGrade) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //각 날짜데이터를 순회. _> 등급별 가격 데이터 순회 _> 시트 개수 만큼 생성.
      let seatsToInsert = [];
      for (let eachDate of schedule) {
        for (let eachPriceByGrade of priceByGrade) {
          const seatCount = eachPriceByGrade.seatCount;

          for (let i = 0; i < seatCount; i++) {
            seatsToInsert.push({
              schedule: eachDate,
              concertId,
              seatType: eachPriceByGrade.grade,
              price: eachPriceByGrade.price,
              status: SeatStatus.AVAILABLE,
              seatNum: eachPriceByGrade.grade + '-' + (i + 1),
            });
          }
        }
      }
      const createSeats = await this.seatRepository.insert(seatsToInsert);
      return createSeats;
    } catch (err) {
      console.log(err);
    }
  }

  async findSeatOfConcert(concertId: number) {
    try {
      return await this.seatRepository.find({ where: { concertId } });
    } catch (err) {
      console.log(err);
    }
  }

  async findSeatByUpdate(scheduleId: number) {
    try {
      return await this.seatRepository.find({ where: { scheduleId } });
    } catch (err) {
      console.log(err);
    }
  }

  async deleteSeat(deleteScheduleArr: Schedule[]) {
    try {
      for (let eachSchedule of deleteScheduleArr) {
        return await this.seatRepository.delete({
          scheduleId: eachSchedule.id,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateSeat(
    concertId: number,
    sameScheduleArr: Schedule[],
    priceByGrade: PriceByGrade[],
  ) {
    try {
      let findSeatScheduleArr = [];
      let modifySeat = [];
      for (let sameSchedule of sameScheduleArr) {
        const findSeat = await this.findSeatByUpdate(sameSchedule.id);
        findSeatScheduleArr.push(...findSeat);
      }
      for (let updateSeat of findSeatScheduleArr) {
        const findGrade = priceByGrade.find(
          (e) => e.grade === updateSeat.seatType,
        );
        updateSeat.price = findGrade.price;
        const modifyPrice = await this.seatRepository.save(updateSeat);
        modifySeat.push(modifyPrice);
      }
      return modifySeat;
    } catch (err) {
      console.log(err);
    }
  }
}
