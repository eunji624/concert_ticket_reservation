import { IsDate, IsNotEmpty } from 'class-validator';

export class ScheduleDto {
  @IsNotEmpty()
  @IsDate()
  date: Date;
}
