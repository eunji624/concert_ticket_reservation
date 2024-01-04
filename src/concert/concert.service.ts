import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entities';
import { DataSource, Like, Repository, getManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConcertDto } from './dto/concert.dto';
import { Admin } from 'src/user/entities/admin.entity';
import { Performer } from 'src/user/entities/performer.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seat/entities/seat.entities';
import { SeatStatus } from 'src/seat/types/seat.status';
import { find } from 'lodash';
import { ScheduleService } from 'src/schedule/schedule.service';
import { SeatService } from 'src/seat/seat.service';
import { ConcertDetailInfo } from './types/concertDetail.type';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
    @Inject(ScheduleService)
    private readonly scheduleService: ScheduleService,
    private readonly seatService: SeatService,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  //공연 리스트 보기
  async allConcertList(): Promise<object> {
    //타입의 일부만 리턴해도 문제 없을까?
    const findConcertList = await this.concertRepository.find({
      where: { confirm: true },
      select: {
        concertName: true,
        concertImage: true,
        concertHallName: true,
      },
    });
    return findConcertList;
  }

  //공연 검색하기
  async searchConcert(query: string): Promise<Concert[]> {
    const searchResult = await this.concertRepository.find({
      where: { concertName: Like(`%${query}%`), confirm: true },
    });
    console.log('searchResult', searchResult);
    return searchResult;
  }

  //공연 상세 보기
  async concertDetail(id: number): Promise<ConcertDetailInfo> {
    const concertDetail = await this.concertRepository.findOne({
      where: { confirm: true, id },
      select: { schedule: true },
    });
    console.log('concertDetail', concertDetail);
    if (!concertDetail) {
      throw new NotFoundException('존재하지 않는 공연입니다.');
    }
    const newSchedule = concertDetail.schedule.map((e) => e.date);
    const concertDetailInfo = {
      performerEmail: concertDetail.performerEmail,
      concertName: concertDetail.concertName,
      concertImage: concertDetail.concertImage,
      concertDescription: concertDetail.concertDescription,
      reservationStart: concertDetail.reservationStart,
      concertHallName: concertDetail.concertHallName,
      date: newSchedule,
    };
    return concertDetailInfo;
  }

  //공연 생성하기
  async createConcert(concertDto, user): Promise<Concert> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const {
      confirm,
      performerEmail,
      concertName,
      concertImage,
      concertDescription,
      reservationStart,
      concertHallName,
      priceByGrade,
      performanceDate,
    } = concertDto;

    try {
      //콘서트 테이블에 이미 동일한 이름이 존재한다면 오류.
      const isAlreadyExist = await queryRunner.manager
        .getRepository(Concert)
        .findOne({
          where: { concertName },
        });
      if (isAlreadyExist) {
        throw new ConflictException('이미 존재하는 공연명 입니다.');
      }

      //concert 테이블에 데이터 넣기
      const saveConcert = await queryRunner.manager
        .getRepository(Concert)
        .save({
          confirm,
          performerEmail,
          concertName,
          concertImage,
          concertDescription,
          reservationStart,
          concertHallName,
        });
      console.log('saveConcert', saveConcert);

      let seatsToInsert = [];
      //스케줄 테이블 데이터 넣기.
      const scheduleData = await this.scheduleService.createSchedule(
        performanceDate,
        saveConcert,
      );

      //scheduleData 결과를 기반으로 시트 테이블 데이터 넣기
      Promise.all(scheduleData).then(async (schedule) => {
        console.log(schedule);
        // throw new Error('테스트');
        const createSeat = await this.seatService.createSeat(
          schedule,
          saveConcert.id,
          priceByGrade,
        );
        console.log('createSeat', createSeat);
      });
      // .catch(async (err) => await queryRunner.rollbackTransaction());

      await queryRunner.commitTransaction();
      if (seatsToInsert.length && saveConcert) {
        return saveConcert;
      }
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //공연 허가하기
  async confirmConcert(id: number): Promise<Concert> {
    try {
      const findConcert = await this.concertRepository.findOneBy({ id: id }); //Promise<ConcertDto>
      if (!findConcert) {
        throw new NotFoundException('존재하지 않는 공연게시글 입니다.');
      }
      findConcert.confirm = true;
      return await this.concertRepository.save(findConcert);
    } catch (err) {
      console.log(err);
    }
  }

  //공연 수정하기
  async modifyConcert(id: number, modifyData: ConcertDto): Promise<Concert> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const {
      confirm,
      performerEmail,
      concertName,
      concertImage,
      concertDescription,
      reservationStart,
      concertHallName,
      priceByGrade,
      performanceDate,
    } = modifyData;
    try {
      //접근 확인
      const isExistConcert = await this.concertRepository.findOneBy({ id });
      if (!isExistConcert) {
        throw new NotFoundException(
          '해당하는 공연 게시글이 존재하지 않습니다.',
        );
      }
      //시트, 스케줄 데이터 찾기
      const findSeatData = await this.seatService.findSeatOfConcert(id);
      const findScheduleData =
        await this.scheduleService.findScheduleOfConcertId(id);

      if (!findScheduleData && !findSeatData) {
        throw new NotFoundException(
          '해당하는 공연 게시글이 존재하지 않습니다.',
        );
      }
      console.log('findSeatData', findSeatData);
      const oldSeatTypeArr = findSeatData.map((eachSeat) => eachSeat.seatType);
      const setOldSeatTypeArr = [...new Set(oldSeatTypeArr)].sort();

      const newSeatTypeArr = priceByGrade
        .map((eachSeat) => eachSeat.grade)
        .sort();

      const newSeatCount = priceByGrade.reduce(
        (acc, cur) => acc + cur.seatCount,
        0,
      );

      if (findSeatData.length / findScheduleData.length !== newSeatCount) {
        console.log('여기서 문제==> ', 1);
        throw new BadRequestException(
          '시트의 타입과 좌석수는 바꿀 수 없습니다.',
        );
      }

      for (let i = 0; i < setOldSeatTypeArr.length; i++) {
        if (setOldSeatTypeArr[i] !== newSeatTypeArr[i]) {
          console.log('여기서 문제==> ', 2);

          throw new BadRequestException(
            '시트의 타입과 좌석수는 바꿀 수 없습니다.',
          );
        }
      }

      //수정하면 다시 관리자 컨펌 받도록 false
      isExistConcert.confirm = false;
      isExistConcert.performerEmail = performerEmail;
      isExistConcert.concertName = concertName;
      isExistConcert.concertImage = concertImage;
      isExistConcert.concertDescription = concertDescription;
      isExistConcert.reservationStart = reservationStart;
      isExistConcert.concertHallName = concertHallName;

      //concert 테이블에 데이터 업데이트
      const updateConcert = await queryRunner.manager
        .getRepository(Concert)
        .save(isExistConcert);
      console.log('updateConcert', updateConcert);

      //시트 데이터 수정하기 전에 등급별 가격 미리 빼두기
      let grade = [];
      for (let eachPriceByGrade of priceByGrade) {
        grade.push(eachPriceByGrade.grade);
        grade.push(eachPriceByGrade.price);
      }
      console.log('grade', grade); //[ 'VIP', 50000, 'S', 45000, 'A', 25000 ]

      //date 변경된 경우의 수
      const findOldDate = findScheduleData.map((e) => e.date).sort();
      const modifyNewDate = performanceDate.sort();

      let sameDate = [];
      let cancelDate = [];
      let createDate = [];

      //날짜 동일한애, 다른애 분별하기
      for (let [i, oldDate] of findOldDate.entries()) {
        const sameD = modifyNewDate.find((newDate) => newDate === oldDate);
        if (sameD) sameDate.push(sameD);
        else cancelDate.push(oldDate);
      }
      for (let [i, newDate] of modifyNewDate.entries()) {
        const sameD = findOldDate.find((oldDate) => newDate === oldDate);
        if (!sameD) createDate.push(newDate);
      }
      console.log('sameDate', sameDate);
      console.log('createDate', createDate);
      console.log('cancelDate', cancelDate);

      //분류한 대로 데이터 처리하기

      //날짜가 추가된 경우(스케줄, 시트)
      const addScheduleArr = await this.scheduleService.createSchedule(
        createDate,
        updateConcert,
      );
      console.log('addScheduleArr', addScheduleArr);
      Promise.all(addScheduleArr).then(async (schedule) => {
        console.log('프로미스안 schedule', schedule);

        const createSeat = await this.seatService.createSeat(
          schedule,
          id,
          priceByGrade,
        );
        console.log('createSeat', createSeat);
      });

      //날짜가 삭제된 경우(스케줄, 시트)
      const deleteScheduleArr = await this.scheduleService.deleteSchedule(
        cancelDate,
        id,
      );
      console.log('deleteScheduleArr', deleteScheduleArr);
      const deleteSeat = await this.seatService.deleteSeat(deleteScheduleArr);
      console.log('deleteSeat', deleteSeat);

      //날짜가 같은 경우(스케줄, 시트)__ 만약 시간이 다른 경우라면? 추가 삭제로 예상중
      console.log('_+_');
      const sameScheduleArr =
        await this.scheduleService.findScheduleGetScheduleId(sameDate, id);
      console.log('sameScheduleArr', sameScheduleArr);
      //시트는 가격만 변경 가능
      const modifySeat = await this.seatService.updateSeat(
        id,
        sameScheduleArr,
        priceByGrade,
      );
      console.log('modifySeat', modifySeat);

      await queryRunner.commitTransaction();
      if (updateConcert) {
        return updateConcert;
      }
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //공연 삭제하기
  async deleteConcert(id: number): Promise<object> {
    try {
      const deleteConcert = await this.concertRepository.delete({ id });
      if (!deleteConcert) {
        throw new NotFoundException(
          '해당하는 공연 게시글이 존재하지 않습니다.',
        );
      }
      return { message: '삭제를 완료했습니다.' };
    } catch (err) {
      console.log('err', err);
    }
  }
}
