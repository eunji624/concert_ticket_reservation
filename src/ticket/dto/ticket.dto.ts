import { TicketStatus } from '../types/ticketStatus.type';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TicketDto {
  @IsNotEmpty()
  status: TicketStatus;

  @IsNotEmpty()
  @IsString()
  concertName: string;

  @IsNotEmpty()
  @IsString()
  concertHallName: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  //콘서트 아이디 값은 유저가 티켓을 예매해서 데이터를 넣을때 콘서트 아이디 값, 날짜 집어넣기.
  @IsNotEmpty()
  @IsNumber()
  concertId: number;

  @IsNotEmpty()
  @IsDate()
  concertDate: Date;
}
