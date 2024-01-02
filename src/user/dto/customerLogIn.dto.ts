import { CustomerRegisterDto } from './customerRegister.dto';
import { PickType } from '@nestjs/mapped-types';

export class CustomerLogInDto extends PickType(CustomerRegisterDto, [
  'email',
  'password',
]) {}
