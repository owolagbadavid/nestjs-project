import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiSchema } from '../../decorators';

@ApiSchema({ name: 'Form_Relation' })
export class FormRelationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  approvals?: boolean;

  user?: boolean;
}
