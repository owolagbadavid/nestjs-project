import { IsNotEmpty, IsString } from 'class-validator';

export class ApprovalOrRejectionDto {
  @IsNotEmpty()
  @IsString()
  remark: string;
}
