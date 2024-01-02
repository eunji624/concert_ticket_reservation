import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from 'src/concert/entities/concert.entities';
import { SeatNum } from 'src/seat/entities/seatNum.entities';
import { SeatGrade } from 'src/seat/entities/seatGrade.entities';
import { Schedule } from './entities/schedule.entity';

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

  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
