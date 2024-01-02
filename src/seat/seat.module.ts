import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatNum } from './entities/seatNum.entities';
// import { SeatController } from './seat.controller';
// import { SeatService } from './seat.service';
import { SeatGrade } from './entities/seatGrade.entities';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWt_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([SeatNum, SeatGrade]),
  ],
  // providers: [SeatService],
  // controllers: [SeatController],
})
export class SeatModule {}
