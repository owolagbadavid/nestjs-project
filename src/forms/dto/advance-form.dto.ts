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
import { AdvanceDetailsDto } from './advance-details.dto';
import { Type } from 'class-transformer';
import { ApiSchema } from '../../decorators';
import { ApiProperty } from '@nestjs/swagger';
import { SupportingDocs } from '../../entities';

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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  emailApproval: SupportingDocs;
}
