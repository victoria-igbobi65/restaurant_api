import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import {
  E_USER_NO_LONGER_EXISTS,
  E_USER_RECENTLY_CHANGED_PASSWORD,
} from 'src/common/constants/constants.text';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const payloadIssuedAt = payload.iat; // Get the time the token was issued
    const user = await this.usersService.findUserByEmail(payload.email);

    if (!user) throw new HttpException(E_USER_NO_LONGER_EXISTS, 403); // check if user with token still exists
    if (user.changePasswordAfter(payloadIssuedAt))
      throw new HttpException(E_USER_RECENTLY_CHANGED_PASSWORD, 401); // check if user has changed their password since they were last issued a token.

    return user;
  }
}
