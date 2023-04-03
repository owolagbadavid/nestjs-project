import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiSchema } from '../../decorators';

@ApiSchema({ name: 'ForgotPassword' })
export class ForogotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
