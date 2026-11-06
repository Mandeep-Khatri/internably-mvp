import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'change_me_access',
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'MODERATOR';
    iat?: number;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { email: true, role: true, passwordChangedAt: true },
    });
    if (!user) throw new UnauthorizedException('Account not found');

    const passwordChangedAtSeconds = user.passwordChangedAt
      ? Math.floor(user.passwordChangedAt.getTime() / 1000)
      : null;
    if (
      passwordChangedAtSeconds !== null &&
      (!payload.iat || payload.iat < passwordChangedAtSeconds)
    ) {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }

    return { ...payload, email: user.email, role: user.role };
  }
}
