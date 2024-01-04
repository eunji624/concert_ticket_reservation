import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Role } from './types/userRole.type';
import { compare, hash } from 'bcrypt';
import _ from 'lodash';

import { Admin } from './entities/admin.entity';
import { Customer } from './entities/customer.entity';
import { Performer } from './entities/performer.entity';
import { ConfigService } from '@nestjs/config';
import { Point } from 'src/ticket/entities/point.entities';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private dataSource: DataSource,

    @InjectRepository(Performer)
    private performerRepository: Repository<Performer>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  //Customer 회원가입
  async customerRegister(customerRegisterDto): Promise<object> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { email, password, passwordRe, name, birth } = customerRegisterDto;
    if (password !== passwordRe) {
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    }

    const existingUser = await queryRunner.manager
      .getRepository(Customer)
      .findOne({
        where: { email },
      });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 계정입니다.');
    }

    try {
      const hashedPassword = await hash(password, 10);
      const customerRegister = await queryRunner.manager
        .getRepository(Customer)
        .save({
          email,
          name,
          birth,
          password: hashedPassword,
          role: Role.CUSTOMER,
        });
      const newCustomerPoint = await queryRunner.manager
        .getRepository(Point)
        .save({
          addPoint: 1000000,
          minusPoint: 0,
          currentPoint: 1000000,
          customer: customerRegister,
        });
      await queryRunner.commitTransaction();
      if (customerRegister && newCustomerPoint) {
        return customerRegister;
      } else {
        return { message: '잠시 후 다시 시도해 주세요.' };
      }
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //Performer 회원가입
  async performerRegister(performerRegisterDto): Promise<object> {
    const {
      email,
      password,
      passwordRe,
      production,
      position,
      name,
      contact_person,
      contact_company,
    } = performerRegisterDto;

    if (password !== passwordRe) {
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    }

    const existingUser = await this.performerRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 계정입니다.');
    }

    try {
      const hashedPassword = await hash(password, 10);
      const performerRegister = await this.performerRepository.save({
        email,
        production,
        position,
        name,
        contact_person,
        contact_company,
        password: hashedPassword,
        role: Role.PERFORMER,
      });
      return performerRegister;
    } catch (err) {
      console.log(err);
    }
  }

  //사이트 관리자 등록 __ db에 바로 등록하는 방법도 괜찮을듯 .
  async adminRegister(adminRegisterDto): Promise<object> {
    const { email, password, passwordRe, name, birth, secretKey } =
      adminRegisterDto;
    const checkSecretKey = this.configService.get('ADMIN_SECRET_KEY');
    //시크릿키를 쉽게 유추할 수 없도록 메세지 동일하게.
    if (secretKey !== checkSecretKey) {
      throw new UnauthorizedException('올바르지 않은 정보입니다.');
    }
    if (password !== passwordRe) {
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    }
    try {
      const existingUser = await this.adminRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('이미 존재하는 계정입니다.');
      }

      const hashedPassword = await hash(password, 10);
      const adminRegister = await this.adminRepository.save({
        email,
        name,
        birth,
        password: hashedPassword,
        role: Role.ADMIN,
      });
      return adminRegister;
    } catch (err) {
      console.log(err);
    }
  }
  //일반회원 로그인
  async customerLogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const findUser = await this.customerRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id'],
    });
    if (_.isNil(findUser)) {
      throw new UnauthorizedException('권한과 이메일을 확인해주세요.');
    }

    if (!(await compare(password, findUser.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, id: findUser.id, role: 'CUSTOMER' };
    return {
      accessToken: this.jwtService.sign(payload), //jwt 토큰을 생성하는 애.
    };
  }

  //공연관계자 로그인
  async performerLogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const findUser = await this.performerRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id'],
    });
    if (_.isNil(findUser)) {
      throw new UnauthorizedException('권한과 이메일을 확인해주세요.');
    }

    if (!(await compare(password, findUser.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, id: findUser.id, role: 'PERFORMER' };
    return {
      accessToken: this.jwtService.sign(payload), //jwt 토큰을 생성하는 애.
    };
  }

  //사이트 관리자 로그인
  async adminLogin(
    email: string,
    password: string,
    secretKey: string,
  ): Promise<{ accessToken: string }> {
    const checkSecretKey = this.configService.get('ADMIN_SECRET_KEY');
    //시크릿키를 쉽게 유추할 수 없도록 메세지 동일하게.
    if (secretKey !== checkSecretKey) {
      throw new UnauthorizedException('올바르지 않은 정보입니다.');
    }
    const findUser = await this.adminRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id'],
    });
    if (_.isNil(findUser)) {
      throw new UnauthorizedException('올바르지 않은 정보입니다.');
    }

    if (!(await compare(password, findUser.password))) {
      throw new UnauthorizedException('올바르지 않은 정보입니다.');
    }

    const payload = { email, id: findUser.id, role: 'ADMIN' };
    return {
      accessToken: this.jwtService.sign(payload), //jwt 토큰을 생성하는 애.
    };
  }

  //내정보 조회(일반유저)
  async customerInfo(user: Customer): Promise<object> {
    const { id } = user;
    const customerInfo = await this.customerRepository.findOne({
      where: { id },
      relations: {
        point: true,
      },
    });
    console.log('customerInfo', customerInfo);
    const sortPoint = customerInfo.point.sort((a, b) => b.id - a.id);
    console.log('sortPoint', sortPoint);

    const customerInfoData = {
      role: customerInfo.role,
      email: customerInfo.email,
      name: customerInfo.name,
      birth: customerInfo.birth,
      point: sortPoint[0].currentPoint,
    };
    console.log('customerInfoData', customerInfoData);

    return customerInfoData;
  }

  //내정보 조회(공연관계자)
  async performerInfo(user: Performer): Promise<object> {
    const { id } = user;
    const performerInfo = await this.performerRepository.findOne({
      where: { id },
    });

    console.log('performerInfo', performerInfo);

    const {
      role,
      email,
      production,
      position,
      name,
      contact_person,
      contact_company,
    } = performerInfo;
    const performerInfoData = {
      role,
      email,
      production,
      position,
      name,
      contact_person,
      contact_company,
    };
    console.log('performerInfoData', performerInfoData);

    return performerInfoData;
  }

  //jwt에서 사용자 인증용 함수.
  async findByCustomerEmail(email: string) {
    return await this.customerRepository.findOneBy({ email });
  }
  async findByPerformerEmail(email: string) {
    return await this.performerRepository.findOneBy({ email });
  }

  async findByAdminEmail(email: string) {
    return await this.adminRepository.findOneBy({ email });
  }
}
