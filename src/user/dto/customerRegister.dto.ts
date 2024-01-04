import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../types/userRole.type';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CustomerRegisterDto {
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @ApiProperty({ required: true, example: 'test@test.com' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  @ApiProperty({
    required: true,
    example: '123123YU',
    description: '비밀번호는 숫자와 문자를 포함 8글자 이상이여야 합니다.',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: '비밀번호는 숫자와 문자를 함께 포함해야 합니다.',
  })
  password: string;

  @IsNotEmpty({ message: '확인 비밀번호를 입력해주세요.' })
  @ApiProperty({
    required: true,
    example: '123123YU',
    description: '비밀번호 확인은 비밀번호 입력값과 일치해야만 합니다. ',
  })
  passwordRe: string;

  @ApiProperty({
    required: true,
    example: '홍길동',
    description: '이름을 입력해주세요.',
  })
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @ApiProperty({
    required: true,
    example: '19950624',
    description: '생일을 입력해주세요.',
  })
  @IsNotEmpty({ message: '생일을 입력해주세요.' })
  birth: Date;
}
