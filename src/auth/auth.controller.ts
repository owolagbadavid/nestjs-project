import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  // Get,
  HttpCode,
  HttpStatus,
  Post,
  // Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  ResetPasswordDto,
  SuperUserDto,
  ForogotPasswordDto,
} from './dtos';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  // ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiRes } from '../types/api-response';
import { User } from '../entities';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ApiRes> {
    const { user, token } = await this.authService.login(loginUserDto);
    const longerExp = 1000 * 60 * 60; // 2 hours
    //!change to '1800s'

    // attach cookie to response
    res.cookie('token', token, {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      signed: true,
      expires: new Date(Date.now() + longerExp),
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'login successful',
      data: user,
    };
  }

  @ApiBadRequestResponse({ type: ApiRes })
  @ApiCreatedResponse({ type: ApiRes })
  @Post('superUserSignup')
  superUserSignup(@Body() superUserDto: SuperUserDto): Promise<ApiRes> {
    return this.authService.superUserSignup(superUserDto);
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
  logout(@Res({ passthrough: true }) res: Response): Promise<ApiRes> {
    // destroy cookie
    res.cookie('token', '', {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      signed: true,
      expires: new Date(),
    });

    // logout user
    return this.authService.logout();
  }

  @ApiOkResponse({ type: ApiRes })
  @UseGuards(AuthGuard('jwt'))
  @Get('check')
  async check(): Promise<ApiRes> {
    return {
      statusCode: HttpStatus.OK,
      message: 'User is logged in',
    };
  }
}
