import { AdminRegisterDto } from './adminRegister.dto';

import { PickType } from '@nestjs/swagger';

export class AdminLoginDto extends PickType(AdminRegisterDto, [
  'email',
  'password',
  'secretKey',
]) {}
