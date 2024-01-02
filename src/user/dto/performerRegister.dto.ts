import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PerformerRegisterDto {
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: '비밀번호는 숫자와 문자를 함께 포함해야 합니다.',
  })
  password: string;

  @IsNotEmpty({ message: '확인 비밀번호를 입력해주세요.' })
  passwordRe: string;

  @IsNotEmpty({ message: '회사 이름을 입력해주세요.' })
  @IsString()
  production: string;

  @IsNotEmpty({ message: '회사 내 직급을 입력해주세요.' })
  @IsString()
  position: string;

  @IsNotEmpty({ message: '가입하시는 분의 이름을 입력해주세요.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '가입하시는 분의 전화번호를 입력해주세요.' })
  @IsString()
  contact_person: string;

  @IsNotEmpty({ message: '회사 전화번호를 입력해주세요.' })
  @IsString()
  contact_company: string;
}
