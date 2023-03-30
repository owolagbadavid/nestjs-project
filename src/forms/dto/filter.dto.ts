import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsPositive } from 'class-validator';
import { ApiSchema } from 'src/decorators';
import { Role } from 'src/entities';

@ApiSchema({ name: 'Filters' })
export class FilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  nextApprovalLevel?: Role;

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
}
