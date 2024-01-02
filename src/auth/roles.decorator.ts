import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/types/userRole.type';

export const Roles = (...roles: Role[]) => {
  return SetMetadata('roles', roles);
};
//커스텀 데코레이터 정의.
//받은 역할을 메타데이터에 설정해서, 해당 역할을 가진 사용자만 접근할 수 있도록 요청하는거임.
//SetMetadata 는 nestjs의 데코레이터.

//...roles를 사용하는 이유
// @Roles(Role.Admin, Role.User)와 같이 사용하면
//'Admin' 또는 'User' 역할 중 하나라도 가지고 있는 사용자에게 접근을 허용할 수 있
