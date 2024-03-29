import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from 'src/concert/entities/concert.entities';
import { Schedule } from './entities/schedule.entity';
import { DataSource, Repository } from 'typeorm';
import { Seat } from 'src/seat/entities/seat.entities';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private dataSource: DataSource,
  ) {}

  async createSchedule(
    performanceDate: string[],
    saveConcert: Concert,
  ): Promise<Schedule[]> {
    try {
      const createScheduleArr = [];
      for (let eachDate of performanceDate) {
        const saveCreatedSchedule = this.scheduleRepository.save({
          date: eachDate,
          concert: saveConcert,
        });
        createScheduleArr.push(saveCreatedSchedule);
      }

      return createScheduleArr;
    } catch (err) {
      console.log(err);
    } finally {
    }
  }

  async findScheduleOfConcertId(concertId: number) {
    try {
      return await this.scheduleRepository.find({ where: { concertId } });
    } catch (err) {
      console.log(err);
    }
  }
  async findScheduleGetScheduleId(sameDateArr: string[], concertId: number) {
    try {
      let findSameScheduleArr = [];
      for (let date of sameDateArr) {
        const findSchedule = await this.scheduleRepository.find({
          where: { date, concertId },
        });
        findSameScheduleArr.push(findSchedule);
      }
      return findSameScheduleArr;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteSchedule(cancelDate: string[], concertId: number) {
    try {
      const findScheduleByDelete = await this.findScheduleGetScheduleId(
        cancelDate,
        concertId,
      );
      for (let cancel of cancelDate) {
        const deleteSchedule = await this.scheduleRepository.delete({
          date: cancel,
          concertId,
        });
      }
      return findScheduleByDelete;
    } catch (err) {
      console.log(err);
    }
  }
}
