import { Controller } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  //스케줄 크리에이트 함수 추가. _ 시트까지 같이 작성.
  constructor(private readonly scheduleService: ScheduleService) {}
}
