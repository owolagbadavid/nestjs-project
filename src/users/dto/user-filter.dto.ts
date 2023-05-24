import { Type } from 'class-transformer';
import { Role } from '../../types';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UserFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  role?: Role;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  dept?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  unit?: number;
}
