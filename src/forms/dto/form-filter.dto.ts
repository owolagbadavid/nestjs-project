import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => Boolean)
  @IsBoolean()
  delegatedByPd?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  pushedToFinance?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  financeGoAhead?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  userId?: number;
}
