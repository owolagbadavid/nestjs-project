import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Products } from 'src/entities';

export class AdvanceDetailsDto {
  @IsNotEmpty()
  @IsString()
  product: Products;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  rate: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  number: number;

  @IsNotEmpty()
  @IsString()
  remark: string;
}
