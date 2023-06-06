import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiSchema } from '../../decorators';
import { Transform } from 'class-transformer';
import { FindOptionsRelations } from 'typeorm';
import { User } from '../../entities';

@ApiSchema({ name: 'Form_Relation' })
export class FormRelationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  approvals?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsOptional()
  @IsBoolean()
  user?: boolean | FindOptionsRelations<User>;
}
