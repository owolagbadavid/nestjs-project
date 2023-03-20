import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.signedCookies && req.signedCookies.token) {
      return req.signedCookies.token;
    }
    return null;
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.usersService.findOneUnfiltered(payload.sub);

    if (!user) throw new UnauthorizedException('Invalid user');

    return (({
      password,
      passwordToken,
      passwordTokenExpiration,
      verificationToken,
      ...rest
    }) => rest)(user);
  }
}
