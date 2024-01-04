import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Ticket } from './entities/ticket.entities';
import { ReservationDto } from './dto/reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';
import { Customer } from 'src/user/entities/customer.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';

@UseGuards(AuthGuard('jwt'))
@Roles(Role.CUSTOMER)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  //티켓 예매하기
  @Post(':id')
  async reservation(
    @UserInfo() user: Customer,
    @Param('id') id: number,
    @Body() reservationDto: ReservationDto,
  ): Promise<Ticket> {
    return await this.ticketService.reservation(user, id, reservationDto);
  }

  //예매 확인하기
  @Get()
  async currentReservation(@UserInfo() user: Customer): Promise<Ticket[]> {
    return await this.ticketService.currentReservation(user);
  }

  //예약 취소하기
  @Delete(':id')
  async cancelReservation(
    @UserInfo() user: Customer,
    @Param('id') id: number,
  ): Promise<object> {
    return await this.ticketService.cancelReservation(user, id);
  }
}
