import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const jwtService = {};
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = 'password-reset-test-secret';
    process.env.NODE_ENV = 'test';
    process.env.EMAIL_PROVIDER = 'mock';
    prisma.user.update.mockResolvedValue({});
    prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    prisma.$transaction.mockResolvedValue([]);
    service = new AuthService(prisma as never, jwtService as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an expiring reset code without returning the code or token', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'student@school.edu',
      passwordResetRequestedAt: null,
    });
    jest.spyOn(console, 'log').mockImplementation(() => undefined);

    const result = await service.forgotPassword(' Student@School.edu ');

    expect(result).toEqual({
      message: 'If that email exists, a 6-digit password reset code has been sent.',
    });
    expect(result).not.toHaveProperty('token');
    expect(result).not.toHaveProperty('code');
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: expect.objectContaining({
        passwordResetCodeHash: expect.stringMatching(/^[a-f0-9]{64}$/),
        passwordResetCodeExpiresAt: expect.any(Date),
        passwordResetRequestedAt: expect.any(Date),
        passwordResetAttempts: 0,
      }),
    });
  });

  it('uses the same response when the email does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const result = await service.forgotPassword('missing@school.edu');

    expect(result.message).toContain('If that email exists');
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('resets the password once and revokes active refresh sessions', async () => {
    const email = 'student@school.edu';
    const code = '123456';
    const codeHash = crypto
      .createHmac('sha256', process.env.JWT_ACCESS_SECRET!)
      .update(`${email}:${code}`)
      .digest('hex');
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email,
      passwordResetCodeHash: codeHash,
      passwordResetCodeExpiresAt: new Date(Date.now() + 60_000),
      passwordResetAttempts: 0,
    });

    const result = await service.resetPassword(email, code, 'NewPassword123!');

    expect(result.message).toContain('Password updated');
    const update = prisma.user.update.mock.calls[0][0];
    expect(await bcrypt.compare('NewPassword123!', update.data.passwordHash)).toBe(true);
    expect(update.data).toEqual(
      expect.objectContaining({
        passwordResetCodeHash: null,
        passwordResetCodeExpiresAt: null,
        passwordResetRequestedAt: null,
        passwordResetAttempts: 0,
        passwordChangedAt: expect.any(Date),
      }),
    );
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });

  it('counts an invalid reset-code attempt', async () => {
    const email = 'student@school.edu';
    const codeHash = crypto
      .createHmac('sha256', process.env.JWT_ACCESS_SECRET!)
      .update(`${email}:123456`)
      .digest('hex');
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email,
      passwordResetCodeHash: codeHash,
      passwordResetCodeExpiresAt: new Date(Date.now() + 60_000),
      passwordResetAttempts: 0,
    });

    await expect(service.resetPassword(email, '654321', 'NewPassword123!')).rejects.toThrow(
      'Invalid or expired password reset code.',
    );
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { passwordResetAttempts: 1 },
    });
  });
});
