import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UserRelationDto {
  @Type(() => Boolean)
  @IsBoolean()
  department?: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  unit?: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  supervisor?: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  delegate?: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  delegator?: boolean;
}
