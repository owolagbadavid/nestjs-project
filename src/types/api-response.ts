import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiRes {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  message: string | string[];
  // verificationToken,

  @ApiPropertyOptional()
  error?: string;

  @ApiPropertyOptional()
  data?: any;
}
