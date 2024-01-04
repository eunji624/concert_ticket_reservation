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

  @IsNotEmpty()
  @IsNumber()
  concertId: number;

  @IsNotEmpty()
  @IsDate()
  concertDate: Date;
}
