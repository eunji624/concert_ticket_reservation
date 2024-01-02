import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Seat } from '../types/seat.type';

export class ConfirmValidationPipe implements PipeTransform {
  readonly ConfirmOptions = [Seat.STANDING, Seat.SEAT];

  transform(value: any) {
    console.log('value', value);
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException('유효하지 않은 상태값을 입력하셧습니다.');
    }
    return value;
  }

  private isStatusValid(status: any) {
    const index = this.ConfirmOptions.indexOf(status);
    return index !== -1; //원하는 값이 아닌 경우 false가 나오도록.
  }
}
