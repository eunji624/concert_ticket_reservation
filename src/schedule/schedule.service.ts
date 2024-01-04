import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from 'src/concert/entities/concert.entities';
import { Schedule } from './entities/schedule.entity';
import { DataSource, Repository } from 'typeorm';
import { Seat } from 'src/seat/entities/seat.entities';

@Injectable()
export class ScheduleService {
  constructor(
    // @InjectRepository(Concert)
    // private concertRepository: Repository<Concert>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    // @InjectRepository(Seat)
    // private seatRepository: Repository<Seat>,
    private dataSource: DataSource,
  ) {}

  async createSchedule(
    performanceDate: string[],
    saveConcert: Concert,
  ): Promise<Schedule[]> {
    console.log('서비스로 넘어왔어요~~~~~~~~~~~');
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    try {
      const createScheduleArr = [];
      for (let eachDate of performanceDate) {
        const saveCreatedSchedule = this.scheduleRepository.save({
          date: eachDate,
          concert: saveConcert,
        });
        // 락처리 .. 왜 ㅠㅠ
        // const createSchedule = await this.dataSource
        //   .getRepository(Schedule)
        //   .createQueryBuilder('schedule')
        //   .setLock('pessimistic_write')
        //   .insert()
        //   .into(Schedule)
        //   .values({ date: eachDate, concert: saveConcert })
        //   .execute();
        createScheduleArr.push(saveCreatedSchedule);
      }

      // await queryRunner.commitTransaction();
      return createScheduleArr;
      // return createScheduleArr as Schedule[];
      // return createSchedule.generatedMaps[0] as Schedule;
    } catch (err) {
      console.log(err);
      // await queryRunner.rollbackTransaction();
    } finally {
      // await queryRunner.release();
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
      console.log('findScheduleByDelete', findScheduleByDelete);

      for (let cancel of cancelDate) {
        console.log('cancel', cancel);

        const deleteSchedule = await this.scheduleRepository.delete({
          date: cancel,
          concertId,
        });
        console.log('deleteSchedule', deleteSchedule);
      }
      return findScheduleByDelete;
    } catch (err) {
      console.log(err);
    }
  }

  // async modifySchedule(modifyDateArr, concertId, priceByGrade) {
  //   try{
  //     for(let modifyDate of modifyDateArr){
  //       const findScheduleByModify = await this.findScheduleGetScheduleId(
  //         modifyDate,
  //         concertId,
  //       );
  //     }
  //   }catch(err){
  //     console.log(err)
  //   }
  // }
}
