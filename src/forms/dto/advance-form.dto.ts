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
import { AdvanceDetailsDto } from '.';
import { Type } from 'class-transformer';
import { ApiSchema } from 'src/decorators';
import { ApiProperty } from '@nestjs/swagger';

@ApiSchema({ name: 'FillAdvanceForm' })
export class AdvanceFormDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  purpose: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  depatureDate: Date;

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

  @ApiProperty({ isArray: true, type: () => AdvanceDetailsDto })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AdvanceDetailsDto)
  details: AdvanceDetailsDto[];

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  totalAmount: number;
}
