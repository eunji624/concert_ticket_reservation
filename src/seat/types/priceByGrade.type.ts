import { SeatType } from './seat.type';

export type PriceByGrade = {
  grade: SeatType;
  price: number;
  seatCount: number;
};
