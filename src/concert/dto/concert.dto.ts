import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PriceByGrade } from '../../seat/types/priceByGrade.type';

export class ConcertDto {
  @IsNotEmpty()
  @IsBoolean()
  confirm: boolean;

  @IsNotEmpty()
  @IsEmail()
  performerEmail: string = 'default@email.com';

  @IsNotEmpty()
  @IsString()
  concertName: string;

  @IsNotEmpty()
  @IsString()
  concertImage: string;

  @IsNotEmpty()
  @IsString()
  concertDescription: string;

  @IsNotEmpty()
  @IsString()
  reservationStart: string;

  @IsNotEmpty()
  @IsString()
  concertHallName: string;

  @IsNotEmpty()
  @IsArray()
  priceByGrade: PriceByGrade[];

  @IsNotEmpty()
  @IsArray()
  performanceDate: string[];
}
