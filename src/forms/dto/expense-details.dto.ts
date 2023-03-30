import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiSchema } from 'src/decorators';
import { Products } from 'src/entities';

@ApiSchema({ name: 'ExpenseDetails' })
export class ExpenseDetailsDto {
  @ApiProperty({ enum: Products, enumName: 'Products' })
  @IsNotEmpty()
  @IsString()
  product: Products;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  number: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  remark: string;
}
