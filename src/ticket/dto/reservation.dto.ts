import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReservationDto {
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsString()
  concertDate: string;

  @IsNotEmpty()
  @IsString()
  seatGrade: string;
}
