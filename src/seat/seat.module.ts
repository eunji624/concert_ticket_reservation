import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from './entities/seat.entities';
import { Concert } from 'src/concert/entities/concert.entities';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWt_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Concert, Schedule, Seat]),
  ],
  providers: [SeatService],
  controllers: [SeatController],
  exports: [SeatService],
})
export class SeatModule {}
