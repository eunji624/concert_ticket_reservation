import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entities';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConcertDto } from './dto/concert.dto';
import { Admin } from 'src/user/entities/admin.entity';
import { Performer } from 'src/user/entities/performer.entity';
import { SeatNum } from '../seat/entities/seatNum.entities';
import { SeatGrade } from 'src/seat/entities/seatGrade.entities';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { ConcertDetailInfo } from './types/concertDetail.type';
// import { ConcertHall } from 'src/seat/entities/concertHall.entities';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,
    @InjectRepository(SeatNum)
    private seatNumRepository: Repository<SeatNum>,
    @InjectRepository(SeatGrade)
    private seatGradeRepository: Repository<SeatGrade>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private readonly jwtService: JwtService,
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
      // select: { schedule: true },
      where: { confirm: true, id },
    });
    if (!concertDetail) {
      throw new NotFoundException('존재하지 않는 공연입니다.');
    }
    const findConcertAllSchedule = await this.scheduleRepository.find({
      where: { concertId: id },
    });
    console.log('concertDetail', concertDetail);
    console.log('findConcertAllSchedule', findConcertAllSchedule);
    const dateArr = findConcertAllSchedule.map((e) => e.date);
    const concertDetailInfo = {
      performerEmail: concertDetail.performerEmail,
      concertName: concertDetail.concertName,
      concertImage: concertDetail.concertImage,
      concertDescription: concertDetail.concertDescription,
      reservationStart: concertDetail.reservationStart,
      concertHallName: concertDetail.concertHallName,
      seatType: concertDetail.seatType,
      price: concertDetail.price,
      date: dateArr,
    };
    return concertDetailInfo;
  }

  //공연 생성하기
  async createConcert(concertDto, user): Promise<Concert> {
    //: Promise<Concert>
    const {
      confirm,
      performerEmail,
      concertName,
      concertImage,
      concertDescription,
      reservationStart,
      concertHallName,
      priceByGrade,
      price,
      seatType,
      date,
      totalSeat,
    } = concertDto;

    try {
      //콘서트 테이블에 이미 동일한 이름이 존재한다면 오류.
      const isAlreadyExist = await this.concertRepository.findOne({
        where: { concertName },
      });
      if (isAlreadyExist) {
        throw new ConflictException('이미 존재하는 공연명 입니다.');
      }
      if (seatType === 'STANDING') {
        let scheduleArr = [];
        //concert 테이블에 데이터 넣기
        const saveConcert = await this.concertRepository.save({
          confirm,
          performerEmail,
          concertName,
          concertImage,
          concertDescription,
          reservationStart,
          concertHallName,
          seatType,
          price,
          // scheduleId: scheduleIdArr,
        });

        for (let eachDate of date) {
          //schedule 테이블에 데이터 넣기
          const scheduleData = await this.scheduleRepository.save({
            date: eachDate,
            concert: saveConcert, // 콘서트와의 연결 추가
            totalSeat,
          });

          // scheduleArr.push(scheduleData);

          //아이디값 추가.
          await this.concertRepository.save({
            scheduleId: scheduleData.id,
            ...saveConcert,
          });
        }
        return saveConcert;
      } else {
        throw new NotAcceptableException('아직 준비되지 않은 서비스입니다.');
      }

      // //schedule, seatGrade, seatNum 테이블에 데이터 넣기
      // let seatGradeArr = [];
      // for (let eachPriceByGrade of priceByGrade) {
      //   //seatGrade 테이블에 데이터 넣기.
      //   const seatGrade = await this.seatGradeRepository.save({
      //     price: eachPriceByGrade.price,
      //     grade: eachPriceByGrade.grade,
      //   });
      //   seatGradeArr.push(seatGrade.id);
      //   //아이디값 추가

      //   await this.scheduleRepository.save({
      //     seatGradeId: seatGrade.id,
      //   });

      //   //seatNum 테이블에 데이터 넣기
      //   for (let i = 0; i < eachPriceByGrade.seat; i++) {
      //     await this.seatNumRepository.save({
      //       seatNum: i + 1,
      //       seatGrade: seatGrade,
      //     });
      //   }
      // }
      // console.log('seatGradeArr', seatGradeArr); //seatGradeArr [ 127, 128, 129 ]

      // // seatNum 테이블에 해당 콘서트 홀 아이디 값이 없다면 등록 안된 공연장!
      // const isExistConcertHall = await this.seatNumRepository.find({
      //   where: { concertHallId },
      // });
      // if (!isExistConcertHall) {
      //   throw new ConflictException('등록되지 않은 공연장입니다.');
      // }

      // const seatGradeArr = await this.seatGradeRepository.find({
      //   where: { concertHallId },
      // });
      // console.log('seatGradeArr', seatGradeArr);
      // const newArrSeatNum = isExistConcertHall.map((seatNum) => {
      //   for (let seatGrade of seatGradeArr) {
      //     if (seatNum.seatGradeId === seatGrade.id) {
      //       return { seatGradeId: seatGrade.grade, seatNum: seatNum.seatNum };
      //     }
      //   }
      // });

      // console.log('newArrSeatNum', typeof newArrSeatNum); //object
      // const jsonNewArrSeatNum = JSON.stringify(newArrSeatNum);
      // console.log('jsonNewArrSeatNum', typeof jsonNewArrSeatNum); //string

      // //req객체에 담긴 유저 emailId을 테이블에 넣어주기.
      // concertDto.performerEmail = user.email;
      // const createConcert = await this.concertRepository.save({
      //   ...newConcertDto,
      //   performerEmail: user.email,
      //   // availableSeat: jsonNewArrSeatNum,
      //   concertHallId: concertHallId, // concertHallId를 명시적으로 설정해야 함
      // });

      // // concertDto.performerEmail = user.email;
      // // const createConcert = await this.concertRepository.save({
      // //   ...concertDto,
      // //   availableSeat: newArrSeatNum,
      // //   concertHallId: concertHallId, // concertHallId를 명시적으로 설정해야 함
      // // });
      // return createConcert;
    } catch (err) {
      console.log(err);
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
    try {
      const isExistConcert = await this.concertRepository.findOneBy({ id });
      if (!isExistConcert) {
        throw new NotFoundException(
          '해당하는 공연 게시글이 존재하지 않습니다.',
        );
      }
      //수정하면 다시 관리자 컨펌 받도록 false
      modifyData.confirm = false;
      const modifyConcert = await this.concertRepository.save({
        ...modifyData,
      });
      return modifyConcert;
    } catch (err) {
      console.log(err);
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
