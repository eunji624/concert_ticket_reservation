import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './entities/point.entities';
import { Ticket } from './entities/ticket.entities';
import { Concert } from 'src/concert/entities/concert.entities';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Ticket, Point, Concert, Schedule]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
