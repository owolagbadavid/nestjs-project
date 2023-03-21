import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiSchema } from 'src/decorators';

@ApiSchema({ name: 'CreateUser' })
export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  unitId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  supervisorId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  role: number;
}
