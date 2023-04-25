import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiSchema } from '../../decorators';
import { Type } from 'class-transformer';

@ApiSchema({ name: 'Form_Relation' })
export class FormRelationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  approvals?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  user?: boolean | object;
}
