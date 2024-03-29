import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/user/types/userRole.type';
import { Roles } from 'src/auth/roles.decorator';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { ConcertDto } from './dto/concert.dto';
import { Performer } from 'src/user/entities/performer.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { Concert } from './entities/concert.entities';
import { ConcertDetailInfo } from './types/concertDetail.type';

@UseGuards(RolesGuard)
@Controller('concert')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  //공연 리스트 보기 __ 롤가드 순서 중요.(아래에 있으면 위에 롤즈가 적용)
  @Get()
  async allConcertList(): Promise<object> {
    return await this.concertService.allConcertList();
  }

  //공연 검색하기 __ 순서 중요. 상세보기 아래 있었더니 id 값을 읽어서 에러남.
  @Get('search')
  async searchConcert(@Query('query') query: string): Promise<Concert[]> {
    console.log('query', query);
    return await this.concertService.searchConcert(query);
  }

  //공연 상세 보기
  @Get(':id')
  async concertDetail(@Param('id') id: number): Promise<ConcertDetailInfo> {
    return await this.concertService.concertDetail(id);
  }

  //공연 등록하기
  @Roles(Role.PERFORMER) //true로 통과했다면
  @Post()
  async createConcert(
    @UserInfo() user: Performer,
    @Body() concertDto: ConcertDto,
  ): Promise<Concert> {
    return await this.concertService.createConcert(concertDto, user);
  }

  //공연 허가하기 (사이트 관리자)
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Patch('confirm/:id')
  async confirmConcert(@Param('id') id: number): Promise<Concert> {
    return await this.concertService.confirmConcert(id);
  }

  //공연 수정하기
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN, Role.PERFORMER)
  @Put(':id')
  async modifyConcert(
    @Param('id') id: number,
    @Body() modifyData: ConcertDto,
  ): Promise<Concert> {
    return await this.concertService.modifyConcert(id, modifyData);
  }

  //공연 삭제하기
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN, Role.PERFORMER)
  @Delete(':id')
  async deleteConcert(@Param('id') id: number): Promise<object> {
    return await this.concertService.deleteConcert(id);
  }
}
