import { Seat } from './seat.type';

export type ConcertDetailInfo = {
  performerEmail: string;
  concertName: string;
  concertImage: string;
  concertDescription: string;
  reservationStart: string;
  concertHallName: string;
  seatType: Seat;
  price: number;
  date: string[];
};
