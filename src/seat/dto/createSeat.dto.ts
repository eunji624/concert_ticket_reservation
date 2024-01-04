import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSeatDto {
  @IsNotEmpty()
  @IsString()
  concertHallName: string;

  @IsNotEmpty()
  @IsString({ each: true })
  seatGrade: string[];

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  seatCountByGrade: number[];

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  seatGradePrice: number[];
}
