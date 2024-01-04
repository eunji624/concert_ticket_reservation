import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import Joi from 'joi';
import { ConcertModule } from './concert/concert.module';
import { Customer } from './user/entities/customer.entity';
import { Performer } from './user/entities/performer.entity';
import { Concert } from './concert/entities/concert.entities';
import { Admin } from './user/entities/admin.entity';
import { SeatModule } from './seat/seat.module';
import { ScheduleModule } from './schedule/schedule.module';
import { Schedule } from './schedule/entities/schedule.entity';
import { TicketModule } from './ticket/ticket.module';
import { Ticket } from './ticket/entities/ticket.entities';
import { Point } from './ticket/entities/point.entities';
import { Seat } from './seat/entities/seat.entities';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
      Customer,
      Performer,
      Admin,
      Concert,
      Schedule,
      Seat,
      Ticket,
      Point,
    ],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UserModule,
    AuthModule,
    ConcertModule,
    SeatModule,
    ScheduleModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
