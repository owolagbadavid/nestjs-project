import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiSchema } from '../../decorators';

@ApiSchema({ name: 'VerifyEmail' })
export class VerifyEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  verificationToken: string;
}
