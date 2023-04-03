import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginUserDto,
  ResetPasswordDto,
  SuperUserDto,
  VerifyEmailDto,
} from './dtos';
import { UsersService } from '../users/users.service';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SerializedUser, User } from '../entities';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async superUserSignup(superUserDto: SuperUserDto) {
    return this.usersService.createSuperUser(superUserDto);
  }

  async login(loginUserDetails: LoginUserDto) {
    const { email, password } = loginUserDetails;

    // find user by email address
    let user: User = await this.usersService.findOneByEmail(email);
    // if not found throw exception
    if (!user) throw new UnauthorizedException('credentials incorrect');

    // compare password
    const pwMatches = await bcrypt.compare(password, user.password);
    // if not match throw exception
    if (!pwMatches) throw new UnauthorizedException('credentials incorrect');

    const token = await this.signToken(user.id, user.email);

    // return user and token
    user = new SerializedUser(user);
    return { user, token };
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });
    return token;
  }
  async logout() {
    // destroy cookie

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged out',
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, verificationToken } = verifyEmailDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('verification failed');

    if (user.isVerified === true)
      throw new BadRequestException('User already verified');

    if (verificationToken !== user.verificationToken)
      throw new UnauthorizedException('verification failed');

    await this.usersService.update(user.id, user);

    return {
      statusCode: HttpStatus.OK,
      message: 'Redirect to reset password page',
      verificationToken,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, email } = resetPasswordDto;
    let { password } = resetPasswordDto;
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      const currentDate = new Date();

      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(password, salt);

      if (
        user.passwordToken === createHash('md5').update(token).digest('hex') &&
        user.passwordTokenExpiration > currentDate
      ) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpiration = null;
        await this.usersService.update(user.id, user);
      }

      // check if it is a new account
      else if (token === user.verificationToken && user.isVerified === false) {
        user.isVerified = true;
        user.password = password;
        user.verificationToken = '';
        user.verified = new Date();
        await this.usersService.update(user.id, user);
      }
      // return after successful update
      return {
        statusCode: HttpStatus.OK,
        message: 'Password successfully updated',
      };
    }

    // throw if the user does not have a valid token or does not exist

    throw new BadRequestException('Invalid token');
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    let passwordToken: string;
    if (user) {
      passwordToken = randomBytes(70).toString('hex');

      //send email

      const tenMinutes = 60 * 10 * 1000;

      const passwordTokenExpiration = new Date(Date.now() + tenMinutes);

      user.passwordToken = createHash('md5')
        .update(passwordToken)
        .digest('hex');
      user.passwordTokenExpiration = passwordTokenExpiration;
      await this.usersService.update(user.id, user);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'check your email for password reset link',
      passwordToken,
    };
  }
}
