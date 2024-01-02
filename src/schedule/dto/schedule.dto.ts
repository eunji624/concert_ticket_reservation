import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';

export class ScheduleDto {
  @IsNotEmpty()
  @IsDate()
  date: Date;
}
