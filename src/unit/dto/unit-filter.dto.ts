import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { ApiSchema } from '../../decorators';
import { Role } from '../../types';

@ApiSchema({ name: 'Unit_Filter' })
export class UnitFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  departmentId?: Role;
}
