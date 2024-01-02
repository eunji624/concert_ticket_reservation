// import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
// import { ConcertService } from '../concert/concert.service';
// import { UserInfo } from 'src/utils/userInfo.decorator';
// import { RolesGuard } from 'src/auth/roles.guard';
// import { Seat } from '../concert/types/seat.type';
// import { Concert } from '../concert/entities/concert.entities';
// import { SeatService } from './seat.service';
// import { SeatNum } from './entities/seatNum.entities';
// import { CreateSeatDto } from './dto/createSeat.dto';
// import { Roles } from 'src/auth/roles.decorator';
// import { Role } from 'src/user/types/userRole.type';

// @UseGuards(RolesGuard)
// @Controller('seat')
// export class SeatController {
//   private logger = new Logger(); //로그 찍기, boardsController아니여도 됨.
//   constructor(private readonly seatService: SeatService) {}

//   //공연장 좌석만들기
//   @Roles(Role.ADMIN)
//   @Post('create')
//   async createSeat(@Body() createSeatDto: CreateSeatDto) {
//     return await this.seatService.createSeat(createSeatDto); //: Promise<SeatNum>
//   }
// }
