import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { ApiSchema } from '../../decorators';

@ApiSchema({ name: 'Form_Relation' })
export class FormRelationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  approvals?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  user?: boolean;
}
