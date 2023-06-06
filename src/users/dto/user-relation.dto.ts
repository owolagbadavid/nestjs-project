import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { User } from 'src/entities';
import { FindOptionsRelations } from 'typeorm';

export class UserRelationDto {
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  department?: boolean | FindOptionsRelations<User>;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  unit?: boolean | FindOptionsRelations<User>;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  supervisor?: boolean | FindOptionsRelations<User>;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  delegate?: boolean | FindOptionsRelations<User>;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  delegator?: boolean | FindOptionsRelations<User>;
}
