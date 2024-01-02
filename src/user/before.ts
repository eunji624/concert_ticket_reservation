// import {
//   ConflictException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
// import { Role } from './types/userRole.type';
// import { compare, hash } from 'bcrypt';
// import _ from 'lodash';

// import { RegisterDto } from './dto/register.dto';
// import { CustomerDetailDto } from './dto/customerDetail.dto';
// import { PerformerDetailDto } from './dto/performerDetail.dto';
// // import { User } from './entities/user.entity';
// import { CustomerDetail } from './entities/customerDetail.entity';
// import { PerformerDetail } from './entities/performerDetail.entity';
// import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

// @Injectable()
// export class UserService {
//   constructor(
//     // @InjectRepository(User)
//     // private userRepository: Repository<User>,
//     @InjectRepository(PerformerDetail)
//     private performerDetailRepository: Repository<PerformerDetail>,
//     @InjectRepository(CustomerDetail)
//     private customerDetailRepository: Repository<CustomerDetail>,
//     private readonly jwtService: JwtService,
//     private dataSource: DataSource,
//   ) {}

//   //한번에 트랜젝션으로 권한변 회원 로그인 처리
//   async registerAndCreateDetail(registerDto): Promise<object> {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     //기본정보 회원가입
//     const { role, email, password } = registerDto;
//     const detailDto = registerDto.customerDetailDto
//       ? registerDto.customerDetailDto
//       : registerDto.performerDetailDto;

//     const existingUser = await queryRunner.manager.getRepository(User).findOne({
//       where: { email },
//     });
//     //사용자는 동일한 이메일 주소로 각각의 권한을 소유할 수 있다.
//     if (existingUser) {
//       if (existingUser.role === role) {
//         throw new ConflictException(
//           '선택하신 권한으로 이미 존재하는 이메일이 있습니다.',
//         );
//       }
//     }
//     try {
//       //기본정보 회원가입 데이터 베이스 넣기.
//       let userDetail: Promise<CustomerDetailDto | PerformerDetailDto>;
//       console.log('role', role);

//       if (role === 'CUSTOMER') {
//         // throw new Error('테스트');
//         userDetail = await queryRunner.manager
//           .getRepository(CustomerDetail)
//           .save({
//             ...detailDto,
//             // user: userRegister,
//           });
//         console.log('userDetail', userDetail);
//         const hashedPassword = await hash(password, 10);
//         const userRegister = await queryRunner.manager
//           .getRepository(User)
//           .save({
//             role,
//             email,
//             password: hashedPassword,
//             customerDetail: userDetail,
//             performerDetail: false,
//           });
//         return { userRegister, userDetail };
//       } else if (role === 'PERFORMER') {
//         userDetail = await queryRunner.manager
//           .getRepository(PerformerDetail)
//           .save({
//             ...detailDto,
//             // user: userRegister,
//           });
//         console.log('userDetail', userDetail);
//         const hashedPassword = await hash(password, 10);
//         const userRegister = await queryRunner.manager
//           .getRepository(User)
//           .save({
//             role,
//             email,
//             password: hashedPassword,
//             customerDetail: false,
//             performerDetail: userDetail,
//           });
//         return { userRegister, userDetail };
//       }

//       await queryRunner.commitTransaction();
//     } catch (err) {
//       console.log(err);
//       await queryRunner.rollbackTransaction();
//     } finally {
//       await queryRunner.release(); // 성공하던, 실패하던 언제나 쿼리러너 해재. 메모리누수,리소스낭비 방지.
//     }
//   }

//   //로그인
//   async login(
//     role: Role,
//     email: string,
//     password: string,
//   ): Promise<{ accessToken: string }> {
//     const findUser = await this.userRepository.findOne({
//       where: { email, role },
//       select: ['email', 'password', 'role', 'id'],
//     });
//     console.log('findUser', findUser);
//     if (_.isNil(findUser)) {
//       throw new UnauthorizedException('권한과 이메일을 확인해주세요.');
//     }

//     if (!(await compare(password, findUser.password))) {
//       throw new UnauthorizedException('비밀번호를 확인해주세요.');
//     }
//     console.log('findUser222');

//     const payload = { email, id: findUser.id };
//     return {
//       accessToken: this.jwtService.sign(payload), //jwt 토큰을 생성하는 애.
//     };
//   }

//   //내정보 조회
//   async userInfo(id: number) {
//     const user = await this.userRepository.findOne({
//       where: { id },
//       relations: ['performerDetail'],
//     });
//     console.log('user', user);
//     // let detail;
//     // if (user.role === 'PERFORMER') {
//     //   //외래키라면 PerformerDetail 엔터티에 직접적으로 존재하지 않을 수 있다.
//     //   await this.performerDetailRepository.findOne({ where: { user_id: id } });
//     // }
//   }

//   async findByEmail(email: string) {
//     return await this.userRepository.findOneBy({ email });
//   }

//   // //회원가입
//   // async register(registerDto: RegisterDto): Promise<User> {
//   //   try {
//   //     const { email, role, password } = registerDto;
//   //     const existingUser = await this.userRepository.findOne({
//   //       where: { email },
//   //     });
//   //     if (existingUser) {
//   //       if (existingUser.role === role) {
//   //         throw new ConflictException(
//   //           '선택하신 권한으로 이미 존재하는 이메일이 있습니다.',
//   //         );
//   //       }
//   //     }

//   //     const hashedPassword = await hash(password, 10);

//   //     const userRegister = await this.userRepository.save({
//   //       email,
//   //       role,
//   //       password: hashedPassword,
//   //     });

//   //     return userRegister;
//   //   } catch (err) {
//   //     throw new Error(err);
//   //     console.log(err);
//   //   }
//   // }

//   // //일반회원 상세정보 등록
//   // async createCustomerInfo(
//   //   id: number,
//   //   customerDetailDto: CustomerDetailDto,
//   // ): Promise<CustomerDetail> {
//   //   // 직접적으로 ID 값을 넘겨서 저장하면, 연관 엔티티를 자동으로 로드하는 기능이 작동하지 않을 수 있다.
//   //   const user = await this.userRepository.findOne({
//   //     select: ['id', 'role'],
//   //     where: { id },
//   //   });
//   //   const customerDetail = await this.customerDetailRepository.save({
//   //     ...customerDetailDto,
//   //     user: user,
//   //   });
//   //   return customerDetail;
//   // }

//   // //공연관계자 상세정보 등록
//   // async createPerformerInfo(
//   //   id: number,
//   //   performerDetailDto: PerformerDetailDto,
//   // ): Promise<PerformerDetail> {
//   //   const user = await this.userRepository.findOne({
//   //     select: ['id', 'role'],
//   //     where: { id },
//   //   });
//   //   console.log('user', user);

//   //   if (user.role !== 'PERFORMER') {
//   //     throw new UnauthorizedException(
//   //       'performer 인 사용자만 접근할 수 있습니다.',
//   //     );
//   //   }

//   //   const alreadyExist = await this.performerDetailRepository.findOne({
//   //     where: { name: performerDetailDto.name },
//   //   });
//   //   if (alreadyExist) {
//   //     throw new UnauthorizedException('이미 상세정보를 등록 하셧습니다.');
//   //     // return;
//   //   }

//   //   const performerDetail = await this.performerDetailRepository.save({
//   //     ...performerDetailDto,
//   //     user: user,
//   //   });
//   //   return performerDetail;
//   // }
// }
