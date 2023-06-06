import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsPositive } from 'class-validator';
import { ApiSchema } from '../../decorators';
import { Role } from '../../types';
import { FindOperator } from 'typeorm';

@ApiSchema({ name: 'Form_Filter' })
export class FormFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  nextApprovalLevel?: Role | FindOperator<Role>;

  @ApiPropertyOptional()
  @IsOptional()
  // convert string to boolean
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  delegatedByPd?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  pushedToFinance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  financeGoAhead?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  userId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  approvedByFin?: boolean;

  retirementId?: any;
}
