import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiSchema } from 'src/decorators';

@ApiSchema({ name: 'Super User Signup' })
export class SuperUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  role: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  supervisorId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  departmentId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  unitId: number;
}
