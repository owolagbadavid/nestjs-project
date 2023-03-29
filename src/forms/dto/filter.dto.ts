import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsPositive } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  nextApprovalLevel?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  delegatedByPd?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  pushedToFinance?: boolean;
}
