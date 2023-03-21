import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiSchema } from 'src/decorators';

@ApiSchema({ name: 'CreateUnit' })
export class CreateUnitDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  headId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  departmentId: number;
}
