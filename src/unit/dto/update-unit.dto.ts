import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiSchema } from 'src/decorators';

@ApiSchema({ name: 'Update Unit' })
export class UpdateUnitDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  headId?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  departmentId?: number;
}
