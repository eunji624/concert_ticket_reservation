import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entities';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { ConcertHall } from '../seat/entities/concertHall.entities';
import { SeatNum } from '../seat/entities/seatNum.entities';
import { SeatGrade } from 'src/seat/entities/seatGrade.entities';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Concert, SeatNum, SeatGrade, Schedule]),
  ],
  providers: [ConcertService],
  controllers: [ConcertController],
})
export class ConcertModule {}
