import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiSchema } from '../../decorators';
import { Role } from '../../types';

@ApiSchema({ name: 'UpdateUser' })
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
  @Type(() => Number)
  @IsNumber()
  departmentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  unitId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  supervisorId?: number;

  @ApiPropertyOptional({ enum: Role, enumName: 'Role' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  role?: Role;
}
