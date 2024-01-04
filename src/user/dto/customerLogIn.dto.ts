import { CustomerRegisterDto } from './customerRegister.dto';
import { PickType } from '@nestjs/swagger';
export class CustomerLogInDto extends PickType(CustomerRegisterDto, [
  'email',
  'password',
]) {}
