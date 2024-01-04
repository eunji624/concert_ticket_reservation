import { Controller, Logger, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { SeatService } from './seat.service';

@Controller()
export class SeatController {
  private logger = new Logger(); //로그 찍기, boardsController아니여도 됨.
  constructor(private readonly seatService: SeatService) {}
}
