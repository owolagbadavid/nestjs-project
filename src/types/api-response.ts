import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiRes {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string | string[];
  // verificationToken,

  @ApiPropertyOptional()
  error?: string;
}
