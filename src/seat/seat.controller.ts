import { Controller, Logger } from '@nestjs/common';
import { SeatService } from './seat.service';

@Controller()
export class SeatController {
  constructor(private readonly seatService: SeatService) {}
}
