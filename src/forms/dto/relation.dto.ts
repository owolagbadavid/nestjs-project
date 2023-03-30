import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiSchema } from 'src/decorators';
import { Role } from 'src/entities';

@ApiSchema({ name: 'Relation' })
export class RelationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  approvals?: boolean;

  user?: boolean;

  nextApproalLevel?: Role;
}
