import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

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
    const user = await this.usersService.findOne(payload.sub, {
      supervisor: { delegate: true, delegator: true },
      delegate: true,
      delegator: true,
      department: true,
      unit: true,
    });

    if (!user) throw new UnauthorizedException('Invalid user');

    // return (({
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   password,
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   passwordToken,
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   passwordTokenExpiration,
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   verificationToken,
    //   ...rest
    // }) => rest)(user);
    console.log(user);

    return user;
  }
}
