import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AdvanceDetailsDto } from './';
import { Type } from 'class-transformer';

export class CreateAdvanceFormDto {
  @IsNotEmpty()
  @IsString()
  purpose: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  depatureDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  returnDate: Date;

  @IsNotEmpty()
  @IsString()
  origination: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AdvanceDetailsDto)
  details: AdvanceDetailsDto[];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  totalAmount: number;
}
