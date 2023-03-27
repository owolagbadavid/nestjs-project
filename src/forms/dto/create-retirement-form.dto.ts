import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ExpenseDetailsDto } from './';

export class CreateRetirementFormDto {
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
  @Type(() => ExpenseDetailsDto)
  details: ExpenseDetailsDto[];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  balanceToStaff: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  balanceToOrganization: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  filesDescription: string[];
}
