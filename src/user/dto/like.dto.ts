import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { number } from 'joi';
import { Int32 } from 'typeorm';

export class PostDto {
  @IsNotEmpty()
  // @Type(() => IsNumber)
  concertId: number[];
}
