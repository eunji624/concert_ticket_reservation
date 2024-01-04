import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/user/types/userRole.type';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    //로그인이 되어 있는 유저인가 확인.(req가 있는지 파악 하면서 확인.)
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }
    console.log('canActivate 가동중');
    //핸들러에 걸려있는 권한 체크
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(), //req, res객체 읽음.
      context.getClass(), //클래스에 설정된 데코레이터, 메타데이터를 읽음.
    ]);

    //권한이 안걸려 있더라고 볼 수 있도록 true? 통과시킬거라는말.
    if (!requiredRoles) {
      return true;
    }

    //req.user.role과 비교해서 true인 경우 이 미들웨어 통과.
    const { user } = context.switchToHttp().getRequest();
    const result = requiredRoles.some((role) => {
      console.log('가동중', user.role === role);

      return user.role === role;
    });
    if (!result) {
      throw new UnauthorizedException('권한이 없습니다.');
    } else {
      return result;
    }
  }
}
