import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class DelegationDto {
  @Type(() => Number)
  @IsPositive()
  @IsNotEmpty()
  delegateId: number;
}
