import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiSchema } from '../../decorators/';

@ApiSchema({ name: 'ForgotPassword' })
export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
