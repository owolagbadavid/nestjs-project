import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ExpenseDetailsDto } from './expense-details.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ApiSchema } from '../../decorators';
import { CurrencyScope } from '../../types';

@ApiSchema({ name: 'FillRetirementForm' })
export class RetirementFormDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  purpose: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  departureDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  returnDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  origination: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  destination: string;

  @ApiProperty({ isArray: true, type: () => ExpenseDetailsDto })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ExpenseDetailsDto)
  details: ExpenseDetailsDto[];

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  balanceToStaff: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  balanceToOrganization: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    isArray: true,
  })
  files: Express.Multer.File[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(CurrencyScope)
  currencyScope: CurrencyScope;
}
