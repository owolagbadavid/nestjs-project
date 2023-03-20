import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiSchema } from 'src/decorators';

@ApiSchema({ name: 'Create Department' })
export class CreateDepartmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  headId?: number;
}
