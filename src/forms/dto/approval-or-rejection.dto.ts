import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiSchema } from 'src/decorators';

@ApiSchema({ name: 'ApprovalOrRejection' })
export class ApprovalOrRejectionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  remark: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  token?: string;
}
