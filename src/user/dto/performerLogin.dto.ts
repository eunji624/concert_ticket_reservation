import { PerformerRegisterDto } from './performerRegister.dto';
import { PickType } from '@nestjs/mapped-types';

export class PerformerLogInDto extends PickType(PerformerRegisterDto, [
  'email',
  'password',
]) {}
