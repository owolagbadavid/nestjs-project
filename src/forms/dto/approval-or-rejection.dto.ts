import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiSchema } from '../../decorators';

@ApiSchema({ name: 'ApprovalOrRejection' })
export class ApprovalOrRejectionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  remark: string;
}
