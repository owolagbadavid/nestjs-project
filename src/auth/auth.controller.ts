import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, ResetPasswordDto, VerifyEmailDto } from './dtos';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiRes } from 'src/types/api-response';
import { User } from 'src/entities';
import { SuperUserDto } from './dtos/super-user.dto';
import { ForogotPasswordDto } from './dtos/forgot-password.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @ApiBadRequestResponse({ type: ApiRes })
  @ApiUnauthorizedResponse({ type: ApiRes })
  @ApiCreatedResponse({ type: User })
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<User> {
    const { user, token } = await this.authService.login(loginUserDto);
    const longerExp = 1000 * 60 * 60 * 2; // 2 hours

    // attach cookie to response
    res.cookie('token', token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      signed: true,
      expires: new Date(Date.now() + longerExp),
    });

    return user;
  }

  @ApiBadRequestResponse({ type: ApiRes })
  @ApiCreatedResponse({ type: ApiRes })
  @Post('superUserSignup')
  superUserSignup(@Body() superUserDto: SuperUserDto): Promise<ApiRes> {
    return this.authService.superUserSignup(superUserDto);
  }

  @ApiBadRequestResponse({ type: ApiRes })
  @ApiUnauthorizedResponse({ type: ApiRes })
  @ApiOkResponse({ type: ApiRes })
  @Get('verifyEmail')
  @ApiQuery({ name: 'email' })
  @ApiQuery({ name: 'verificationToken' })
  verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<ApiRes> {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @ApiBadRequestResponse({ type: ApiRes })
  @ApiOkResponse({ type: ApiRes })
  @HttpCode(HttpStatus.OK)
  @Post('forgotPassword')
  forgotPassword(
    @Body() forgotPasswordDto: ForogotPasswordDto,
  ): Promise<ApiRes> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiBadRequestResponse({ type: ApiRes })
  @ApiOkResponse({ type: ApiRes })
  @HttpCode(HttpStatus.OK)
  @Post('resetPassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ApiRes> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOkResponse({ type: ApiRes })
  @Delete('logout')
  logout(): Promise<ApiRes> {
    return this.authService.logout();
  }
}
