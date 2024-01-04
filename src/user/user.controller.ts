import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

import { CustomerRegisterDto } from './dto/customerRegister.dto';
import { PerformerRegisterDto } from './dto/performerRegister.dto';
import { CustomerLogInDto } from './dto/customerLogIn.dto';
import { PerformerLogInDto } from './dto/performerLogin.dto';

import { Roles } from 'src/auth/roles.decorator';
import { Role } from './types/userRole.type';
import { AuthGuard } from '@nestjs/passport';
import { AdminRegisterDto } from './dto/adminRegister.dto';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  private logger = new Logger('UserController');
  constructor(private readonly userService: UserService) {}

  //일반회원 가입
  //TODO 이미 회원가입이 된 회원이 또 회원가입을 같은 권한으로 하려 한다면 막기
  @ApiOperation({
    summary: '일반고객 회원가입',
    description: '회원가입을 하는 란입니다. ',
  })
  // @ApiParam(name:'name')
  @Post('register/customer')
  async customerRegister(
    @Body() customerRegisterDto: CustomerRegisterDto,
  ): Promise<object> {
    return await this.userService.customerRegister(customerRegisterDto);
  }

  //공연관리측 회원가입
  //TODO 이미 회원가입이 된 회원이 또 회원가입을 같은 권한으로 하려 한다면 막기
  @Post('register/performer')
  async performerRegister(
    @Body() performerRegisterDto: PerformerRegisterDto,
  ): Promise<object> {
    return await this.userService.performerRegister(performerRegisterDto);
  }

  //사이트관리자 등록
  //TODO 이미 회원가입이 된 회원이 또 회원가입을 같은 권한으로 하려 한다면 막기
  @Post('register/admin')
  async adminRegister(
    @Body() adminRegisterDto: AdminRegisterDto,
  ): Promise<object> {
    console.log('adminRegisterDto', adminRegisterDto);
    return await this.userService.adminRegister(adminRegisterDto);
  }

  //일반회원 로그인
  //TODO 이미 로그인 된 사용자가 로그인 또 못하게
  @Post('login/customer')
  async customerLogin(
    @Body() customerLogInDto: CustomerLogInDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = customerLogInDto;

    const userAccessToken = await this.userService.customerLogin(
      email,
      password,
    );
    return userAccessToken;
  }

  //공연관리측 로그인
  //TODO 이미 로그인 된 사용자가 로그인 또 못하게
  @Post('login/performer')
  async performerLogin(
    @Body() performerLogInDto: PerformerLogInDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = performerLogInDto;

    const userAccessToken = await this.userService.performerLogin(
      email,
      password,
    );
    return userAccessToken;
  }

  //사이트관리자 로그인
  //TODO 이미 로그인 된 사용자가 로그인 또 못하게
  @Post('login/admin')
  async adminLogin(
    @Body() adminLoginDto: AdminLoginDto,
  ): Promise<{ accessToken: string }> {
    const { email, password, secretKey } = adminLoginDto;
    console.log('adminLoginDto', adminLoginDto);
    const userAccessToken = await this.userService.adminLogin(
      email,
      password,
      secretKey,
    );
    return userAccessToken;
  }

  //내정보 조회(일반유저)
  @ApiBearerAuth() //swagger에 token이 있는지 없는지 확인.
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.CUSTOMER)
  @Get('customer/:id')
  async customerInfo(@Param('id') id: number): Promise<object> {
    return await this.userService.customerInfo(id);
  }

  //내정보 조회(공연관계자)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.PERFORMER)
  @Get('performer/:id')
  async performerInfo(@Param('id') id: number): Promise<object> {
    return await this.userService.performerInfo(id);
  }
}
