import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Users2 } from '../entity/users2.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interface/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users2)
    private readonly userRepository: Repository<Users2>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }
    async validate(payload: JwtPayload): Promise<Users2> {
    const foundUser = await this.userRepository.findOne({ where: { id: Number(payload.sub) } });
    if (!foundUser) {
      throw new UnauthorizedException('User not found');

    }
    //console.log(founduser);
    return foundUser;
  }
}
