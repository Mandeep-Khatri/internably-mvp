import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

type GoogleTokenInfo = {
  sub?: string;
  email?: string;
  email_verified?: string | boolean;
  aud?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly studentOnlyMessage =
    'Internably is currently available only for students with a valid .edu email address.';

  private async signTokens(user: { id: string; email: string; role: 'USER' | 'ADMIN' | 'MODERATOR' }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'change_me_access',
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    });
    return { accessToken, refreshToken };
  }

  private getRefreshSecret() {
    return process.env.JWT_REFRESH_SECRET || 'change_me_refresh';
  }

  private fallbackRefreshExpiry() {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  }

  private async refreshTokenExpiresAt(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync<{ exp?: number }>(refreshToken, {
        secret: this.getRefreshSecret(),
      });
      if (decoded?.exp) {
        return new Date(decoded.exp * 1000);
      }
    } catch {
      // Ignore here; caller already validates token where required.
    }
    return this.fallbackRefreshExpiry();
  }

  private async createRefreshSession(userId: string, refreshToken: string) {
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = await this.refreshTokenExpiresAt(refreshToken);
    return this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  private async findMatchingActiveRefreshSession(userId: string, refreshToken: string) {
    const sessions = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    for (const session of sessions) {
      const match = await bcrypt.compare(refreshToken, session.tokenHash);
      if (match) return session;
    }
    return null;
  }

  private async detectRefreshTokenReuse(userId: string, refreshToken: string) {
    const revokedSessions = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: { not: null },
      },
      orderBy: { revokedAt: 'desc' },
      take: 20,
    });
    for (const session of revokedSessions) {
      const reused = await bcrypt.compare(refreshToken, session.tokenHash);
      if (reused) {
        await this.prisma.refreshToken.updateMany({
          where: { userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        throw new UnauthorizedException('Refresh token reuse detected. Please login again.');
      }
    }
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private isEduEmail(email: string) {
    const domain = this.normalizeEmail(email).split('@')[1] ?? '';
    return domain.endsWith('.edu');
  }

  private hashVerificationToken(rawToken: string) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  private generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  private getEmailProvider() {
    return (process.env.EMAIL_PROVIDER || 'mock').trim().toLowerCase();
  }

  private getEmailFromAddress() {
    return (process.env.EMAIL_FROM || 'Internably <no-reply@internably.com>').trim();
  }

  private async sendEmail({
    to,
    subject,
    html,
    text,
  }: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }) {
    const provider = this.getEmailProvider();

    if (provider === 'resend') {
      const apiKey = (process.env.RESEND_API_KEY || '').trim();
      if (!apiKey) {
        throw new BadRequestException('Email provider is configured as resend, but RESEND_API_KEY is missing.');
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.getEmailFromAddress(),
          to: [to],
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new BadRequestException(`Email send failed: ${details}`);
      }
      return;
    }

    // Mock mode for local development without an email provider.
    console.log(`[Internably] email(mock) -> ${to} | ${subject}`);
    console.log(text);
  }

  private getVerificationLink(token: string) {
    const explicitBase = process.env.EMAIL_VERIFICATION_BASE_URL?.trim();
    const apiPublicBase =
      process.env.API_PUBLIC_BASE_URL?.trim() || process.env.PUBLIC_API_BASE_URL?.trim();
    const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
    const defaultBase = isProd
      ? 'https://internably.com/verify-email'
      : `${apiPublicBase || 'http://localhost:4000/api'}/auth/verify-email`;
    const base = explicitBase || defaultBase;
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}token=${encodeURIComponent(token)}`;
  }

  private inferUniversityFromEduEmail(email: string): string | undefined {
    const domain = this.normalizeEmail(email).split('@')[1] ?? '';
    const map: Record<string, string> = {
      'harvard.edu': 'Harvard University',
      'aamu.edu': 'Alabama A&M University',
      'utexas.edu': 'University of Texas',
    };

    for (const [key, school] of Object.entries(map)) {
      if (domain === key || domain.endsWith(`.${key}`)) return school;
    }
    return undefined;
  }

  private async sendVerificationEmail(email: string, token: string) {
    const verificationLink = this.getVerificationLink(token);
    await this.sendEmail({
      to: email,
      subject: 'Verify your Internably account',
      text: `Welcome to Internably.\n\nVerify your email by opening this link:\n${verificationLink}\n\nThis link expires in 24 hours.`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
          <h2>Welcome to Internably</h2>
          <p>Verify your email to activate your account.</p>
          <p>
            <a href="${verificationLink}" style="display:inline-block;padding:10px 14px;background:#0E8F2C;color:#F6F3EA;text-decoration:none;border-radius:8px;font-weight:700">
              Verify email
            </a>
          </p>
          <p>If the button does not work, open this link:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
    });
    return verificationLink;
  }

  private async getGoogleTokenInfo(idToken: string): Promise<GoogleTokenInfo> {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new UnauthorizedException('Invalid Google token.');
    }
    return (await response.json()) as GoogleTokenInfo;
  }

  private parseGoogleEmailVerified(value: string | boolean | undefined) {
    if (typeof value === 'boolean') return value;
    return value === 'true';
  }

  private async createUniqueUsername(seedValue: string) {
    const cleaned = seedValue
      .toLowerCase()
      .replace(/[^a-z0-9._]/g, '')
      .slice(0, 24);
    const base = cleaned || 'student';
    let candidate = base;
    let counter = 1;

    while (await this.prisma.user.findUnique({ where: { username: candidate } })) {
      counter += 1;
      candidate = `${base}${counter}`;
    }
    return candidate;
  }

  async register(dto: RegisterDto) {
    const normalizedEmail = this.normalizeEmail(dto.email);
    if (!this.isEduEmail(normalizedEmail)) {
      throw new BadRequestException(this.studentOnlyMessage);
    }

    const localPart = normalizedEmail.split('@')[0] ?? '';
    const usernameSeed = dto.username?.trim() || localPart;
    const username = await this.createUniqueUsername(usernameSeed);
    const exists = await this.prisma.user.findFirst({
      where: { email: normalizedEmail },
    });
    if (exists) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const rawVerificationToken = this.generateVerificationToken();
    const verificationTokenHash = this.hashVerificationToken(rawVerificationToken);
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const university = this.inferUniversityFromEduEmail(normalizedEmail);
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        username,
        passwordHash,
        verificationTokenHash,
        verificationTokenExpiresAt,
        isApproved: false,
        profile: {
          create: {
            firstName: username,
            lastName: '',
            ...(university
              ? {
                  school: {
                    connectOrCreate: {
                      where: { name: university },
                      create: { name: university },
                    },
                  },
                }
              : {}),
          },
        },
      },
    });

    const verificationLink = await this.sendVerificationEmail(user.email, rawVerificationToken);

    return {
      userId: user.id,
      requiresEmailVerification: true,
      requiresApproval: true,
      message: 'Check your .edu email to verify your Internably account.',
      verificationLink: process.env.NODE_ENV === 'production' ? undefined : verificationLink,
    };
  }

  async login(dto: LoginDto) {
    const normalizedEmail = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified. Check your .edu inbox and verify your account.');
    }
    if (!user.isApproved) throw new UnauthorizedException('Application not approved yet');

    const tokens = await this.signTokens({ id: user.id, email: user.email, role: user.role });
    await this.createRefreshSession(user.id, tokens.refreshToken);

    return { user, ...tokens };
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashVerificationToken(token);
    const user = await this.prisma.user.findUnique({
      where: { verificationTokenHash: tokenHash },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token.');
    }

    if (!user.verificationTokenExpiresAt || user.verificationTokenExpiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationTokenHash: null,
        verificationTokenExpiresAt: null,
      },
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async resendVerificationEmail(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return { message: 'If that email exists, a verification link has been sent.' };
    }

    if (user.isVerified) {
      return { message: 'Email is already verified. Please log in.' };
    }

    const rawVerificationToken = this.generateVerificationToken();
    const verificationTokenHash = this.hashVerificationToken(rawVerificationToken);
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationTokenHash,
        verificationTokenExpiresAt,
      },
    });

    const verificationLink = await this.sendVerificationEmail(normalizedEmail, rawVerificationToken);
    return {
      message: 'Verification email sent. Check your .edu inbox.',
      verificationLink: process.env.NODE_ENV === 'production' ? undefined : verificationLink,
    };
  }

  async googleAuth(idToken: string) {
    if (!idToken) {
      throw new BadRequestException('Google idToken is required.');
    }

    const tokenInfo = await this.getGoogleTokenInfo(idToken);
    const normalizedEmail = this.normalizeEmail(tokenInfo.email ?? '');
    const emailVerified = this.parseGoogleEmailVerified(tokenInfo.email_verified);

    if (!normalizedEmail || !emailVerified) {
      throw new UnauthorizedException('Google account email is not verified.');
    }
    if (!this.isEduEmail(normalizedEmail)) {
      throw new BadRequestException(this.studentOnlyMessage);
    }

    const configuredClientIds = (process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_CLIENT_ID || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    if (configuredClientIds.length > 0 && !configuredClientIds.includes(tokenInfo.aud ?? '')) {
      throw new UnauthorizedException('Google token audience mismatch.');
    }

    const localPart = normalizedEmail.split('@')[0] ?? 'student';
    let user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      const username = await this.createUniqueUsername(localPart);
      const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
      const inferredUniversity = this.inferUniversityFromEduEmail(normalizedEmail);

      const displayName = tokenInfo.name?.trim() ?? '';
      const fallbackFirstName = displayName.split(' ')[0] || localPart;
      const fallbackLastName = displayName.split(' ').slice(1).join(' ') || '';

      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          username,
          passwordHash,
          isVerified: true,
          isApproved: true,
          profile: {
            create: {
              firstName: tokenInfo.given_name?.trim() || fallbackFirstName,
              lastName: tokenInfo.family_name?.trim() || fallbackLastName,
              avatarUrl: tokenInfo.picture ?? null,
              ...(inferredUniversity
                ? {
                    school: {
                      connectOrCreate: {
                        where: { name: inferredUniversity },
                        create: { name: inferredUniversity },
                      },
                    },
                  }
                : {}),
            },
          },
        },
      });
    }

    if (!user.isVerified) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
      user.isVerified = true;
    }

    if (!user.isApproved) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isApproved: true },
      });
      user.isApproved = true;
    }

    const tokens = await this.signTokens({ id: user.id, email: user.email, role: user.role });
    await this.createRefreshSession(user.id, tokens.refreshToken);

    return { user, ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; email: string; role: 'USER' | 'ADMIN' | 'MODERATOR' }>(
        refreshToken,
        { secret: this.getRefreshSecret() },
      );

      const match = await this.findMatchingActiveRefreshSession(payload.sub, refreshToken);
      if (!match) {
        await this.detectRefreshTokenReuse(payload.sub, refreshToken);
        throw new UnauthorizedException('Invalid refresh token');
      }
      const tokens = await this.signTokens({ id: payload.sub, email: payload.email, role: payload.role });
      await this.prisma.$transaction([
        this.prisma.refreshToken.update({
          where: { id: match.id },
          data: { revokedAt: new Date() },
        }),
        this.prisma.refreshToken.create({
          data: {
            userId: payload.sub,
            tokenHash: await bcrypt.hash(tokens.refreshToken, 10),
            expiresAt: await this.refreshTokenExpiresAt(tokens.refreshToken),
          },
        }),
      ]);
      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string) {
    const sessions = await this.prisma.refreshToken.findMany({ where: { userId, revokedAt: null } });
    for (const session of sessions) {
      const match = await bcrypt.compare(refreshToken, session.tokenHash);
      if (match) {
        await this.prisma.refreshToken.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
        return { success: true };
      }
    }
    return { success: true };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If that email exists, reset instructions were sent.' };
    const token = await this.jwtService.signAsync(
      { sub: user.id, type: 'password-reset' },
      { secret: process.env.JWT_ACCESS_SECRET || 'change_me_access', expiresIn: '30m' },
    );
    return { message: 'Password reset token generated (MVP)', token };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = await this.jwtService.verifyAsync<{ sub: string; type: string }>(token, {
      secret: process.env.JWT_ACCESS_SECRET || 'change_me_access',
    });
    if (payload.type !== 'password-reset') throw new UnauthorizedException('Invalid token type');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: payload.sub }, data: { passwordHash } });
    return { message: 'Password updated' };
  }
}
