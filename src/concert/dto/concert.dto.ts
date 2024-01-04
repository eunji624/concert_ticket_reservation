import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConfirmValidationPipe } from '../pipes/concert.confirm.validation.pipe';
import { StringIterator } from 'lodash';
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

  // @IsNotEmpty()
  // @Validate(ConfirmValidationPipe) //근데 여기서도 되네?:????
  // seatType: Seat; //커스텀 파이프를 핸들러 파이프로 걸기.

  // @IsNotEmpty()
  // @IsNumber()
  // price: number;

  // @IsNotEmpty()
  // @IsArray()
  // date: Date[];

  // @IsJSON()
  // availableSeat: JSON[];
  // @IsNotEmpty()
  // @IsString()
  // concertHallId: string; //id 값을 프론트에서 공연장을 클릭하면 id 값 넘겨주도록.

  // @IsNotEmpty()
  // @IsNumber()
  // totalSeat: number;
}
