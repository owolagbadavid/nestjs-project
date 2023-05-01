import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { User } from 'src/entities';
import { FindOptionsRelations } from 'typeorm';

export class UserRelationDto {
  @Type(() => Boolean)
  @IsBoolean()
  department?: boolean | FindOptionsRelations<User>;

  @Type(() => Boolean)
  @IsBoolean()
  unit?: boolean | FindOptionsRelations<User>;

  @Type(() => Boolean)
  @IsBoolean()
  supervisor?: boolean | FindOptionsRelations<User>;

  @Type(() => Boolean)
  @IsBoolean()
  delegate?: boolean | FindOptionsRelations<User>;

  @Type(() => Boolean)
  @IsBoolean()
  delegator?: boolean | FindOptionsRelations<User>;
}
