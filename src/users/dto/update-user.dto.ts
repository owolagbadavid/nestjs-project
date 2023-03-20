import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiSchema } from 'src/decorators';

@ApiSchema({ name: 'Update User' })
export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  unitId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  supervisorId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  role?: number;
}
