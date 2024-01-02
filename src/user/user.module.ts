import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Performer } from './entities/performer.entity';
import { Customer } from './entities/customer.entity';
import { Admin } from './entities/admin.entity';
import { Point } from 'src/ticket/entities/point.entities';

@Module({
  imports: [
    //jwt 시크릿키 주입.
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Performer, Customer, Admin, Point]),
  ], //잊지말고 넣기.
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
