import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entities';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seat/entities/seat.entities';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { SeatModule } from 'src/seat/seat.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Concert, Schedule, Seat]),
    ScheduleModule,
    SeatModule,
  ],
  providers: [ConcertService],
  controllers: [ConcertController],
})
export class ConcertModule {}
