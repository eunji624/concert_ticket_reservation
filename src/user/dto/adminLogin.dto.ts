import { AdminRegisterDto } from './adminRegister.dto';
import { PickType } from '@nestjs/mapped-types';

export class AdminLoginDto extends PickType(AdminRegisterDto, [
  'email',
  'password',
  'secretKey',
]) {}
