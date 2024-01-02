import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //토큰을 추출하는 방법 지정.해더에 토큰을 베어러방식으로인증
      ignoreExpiration: false, //토큰의 만료여부 확인하겠음.
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    const findByPerformer = await this.userService.findByPerformerEmail(
      payload.email,
    );
    const findByCustomer = await this.userService.findByCustomerEmail(
      payload.email,
    );
    const findByAdmin = await this.userService.findByAdminEmail(payload.email);
    if (
      _.isNil(findByPerformer) &&
      _.isNil(findByCustomer) &&
      _.isNil(findByAdmin)
    ) {
      throw new NotFoundException('해당되는 사용자를 찾을 수 없습니다.');
    }

    return findByPerformer || findByCustomer || findByAdmin;
  }
}
