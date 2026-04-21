"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwtService) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            this.studentOnlyMessage = 'Internably is currently available only for students with a valid .edu email address.';
        }
        AuthService_1.prototype.signTokens = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, accessToken, refreshToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            payload = { sub: user.id, email: user.email, role: user.role };
                            return [4 /*yield*/, this.jwtService.signAsync(payload, {
                                    secret: process.env.JWT_ACCESS_SECRET || 'change_me_access',
                                    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
                                })];
                        case 1:
                            accessToken = _a.sent();
                            return [4 /*yield*/, this.jwtService.signAsync(payload, {
                                    secret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh',
                                    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
                                })];
                        case 2:
                            refreshToken = _a.sent();
                            return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
                    }
                });
            });
        };
        AuthService_1.prototype.getRefreshSecret = function () {
            return process.env.JWT_REFRESH_SECRET || 'change_me_refresh';
        };
        AuthService_1.prototype.fallbackRefreshExpiry = function () {
            return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        };
        AuthService_1.prototype.refreshTokenExpiresAt = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var decoded, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.jwtService.verifyAsync(refreshToken, {
                                    secret: this.getRefreshSecret(),
                                })];
                        case 1:
                            decoded = _b.sent();
                            if (decoded === null || decoded === void 0 ? void 0 : decoded.exp) {
                                return [2 /*return*/, new Date(decoded.exp * 1000)];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/, this.fallbackRefreshExpiry()];
                    }
                });
            });
        };
        AuthService_1.prototype.createRefreshSession = function (userId, refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenHash, expiresAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bcrypt.hash(refreshToken, 10)];
                        case 1:
                            tokenHash = _a.sent();
                            return [4 /*yield*/, this.refreshTokenExpiresAt(refreshToken)];
                        case 2:
                            expiresAt = _a.sent();
                            return [2 /*return*/, this.prisma.refreshToken.create({
                                    data: {
                                        userId: userId,
                                        tokenHash: tokenHash,
                                        expiresAt: expiresAt,
                                    },
                                })];
                    }
                });
            });
        };
        AuthService_1.prototype.findMatchingActiveRefreshSession = function (userId, refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var sessions, _i, sessions_1, session, match;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.refreshToken.findMany({
                                where: {
                                    userId: userId,
                                    revokedAt: null,
                                    expiresAt: { gt: new Date() },
                                },
                                orderBy: { createdAt: 'desc' },
                            })];
                        case 1:
                            sessions = _a.sent();
                            _i = 0, sessions_1 = sessions;
                            _a.label = 2;
                        case 2:
                            if (!(_i < sessions_1.length)) return [3 /*break*/, 5];
                            session = sessions_1[_i];
                            return [4 /*yield*/, bcrypt.compare(refreshToken, session.tokenHash)];
                        case 3:
                            match = _a.sent();
                            if (match)
                                return [2 /*return*/, session];
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, null];
                    }
                });
            });
        };
        AuthService_1.prototype.detectRefreshTokenReuse = function (userId, refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var revokedSessions, _i, revokedSessions_1, session, reused;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.refreshToken.findMany({
                                where: {
                                    userId: userId,
                                    revokedAt: { not: null },
                                },
                                orderBy: { revokedAt: 'desc' },
                                take: 20,
                            })];
                        case 1:
                            revokedSessions = _a.sent();
                            _i = 0, revokedSessions_1 = revokedSessions;
                            _a.label = 2;
                        case 2:
                            if (!(_i < revokedSessions_1.length)) return [3 /*break*/, 6];
                            session = revokedSessions_1[_i];
                            return [4 /*yield*/, bcrypt.compare(refreshToken, session.tokenHash)];
                        case 3:
                            reused = _a.sent();
                            if (!reused) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.refreshToken.updateMany({
                                    where: { userId: userId, revokedAt: null },
                                    data: { revokedAt: new Date() },
                                })];
                        case 4:
                            _a.sent();
                            throw new common_1.UnauthorizedException('Refresh token reuse detected. Please login again.');
                        case 5:
                            _i++;
                            return [3 /*break*/, 2];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.normalizeEmail = function (email) {
            return email.trim().toLowerCase();
        };
        AuthService_1.prototype.isEduEmail = function (email) {
            var _a;
            var domain = (_a = this.normalizeEmail(email).split('@')[1]) !== null && _a !== void 0 ? _a : '';
            return domain.endsWith('.edu');
        };
        AuthService_1.prototype.hashVerificationToken = function (rawToken) {
            return crypto.createHash('sha256').update(rawToken).digest('hex');
        };
        AuthService_1.prototype.generateVerificationToken = function () {
            return crypto.randomBytes(32).toString('hex');
        };
        AuthService_1.prototype.getEmailProvider = function () {
            return (process.env.EMAIL_PROVIDER || 'mock').trim().toLowerCase();
        };
        AuthService_1.prototype.getEmailFromAddress = function () {
            return (process.env.EMAIL_FROM || 'Internably <no-reply@internably.com>').trim();
        };
        AuthService_1.prototype.sendEmail = function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var provider, apiKey, response, details;
                var to = _b.to, subject = _b.subject, html = _b.html, text = _b.text;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            provider = this.getEmailProvider();
                            if (!(provider === 'resend')) return [3 /*break*/, 4];
                            apiKey = (process.env.RESEND_API_KEY || '').trim();
                            if (!apiKey) {
                                throw new common_1.BadRequestException('Email provider is configured as resend, but RESEND_API_KEY is missing.');
                            }
                            return [4 /*yield*/, fetch('https://api.resend.com/emails', {
                                    method: 'POST',
                                    headers: {
                                        Authorization: "Bearer ".concat(apiKey),
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        from: this.getEmailFromAddress(),
                                        to: [to],
                                        subject: subject,
                                        html: html,
                                        text: text,
                                    }),
                                })];
                        case 1:
                            response = _c.sent();
                            if (!!response.ok) return [3 /*break*/, 3];
                            return [4 /*yield*/, response.text()];
                        case 2:
                            details = _c.sent();
                            throw new common_1.BadRequestException("Email send failed: ".concat(details));
                        case 3: return [2 /*return*/];
                        case 4:
                            // Mock mode for local development without an email provider.
                            console.log("[Internably] email(mock) -> ".concat(to, " | ").concat(subject));
                            console.log(text);
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.getVerificationLink = function (token) {
            var _a, _b, _c;
            var explicitBase = (_a = process.env.EMAIL_VERIFICATION_BASE_URL) === null || _a === void 0 ? void 0 : _a.trim();
            var apiPublicBase = ((_b = process.env.API_PUBLIC_BASE_URL) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = process.env.PUBLIC_API_BASE_URL) === null || _c === void 0 ? void 0 : _c.trim());
            var isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
            var defaultBase = isProd
                ? 'https://internably.com/verify-email'
                : "".concat(apiPublicBase || 'http://localhost:4000/api', "/auth/verify-email");
            var base = explicitBase || defaultBase;
            var separator = base.includes('?') ? '&' : '?';
            return "".concat(base).concat(separator, "token=").concat(encodeURIComponent(token));
        };
        AuthService_1.prototype.inferUniversityFromEduEmail = function (email) {
            var _a;
            var domain = (_a = this.normalizeEmail(email).split('@')[1]) !== null && _a !== void 0 ? _a : '';
            var map = {
                'harvard.edu': 'Harvard University',
                'aamu.edu': 'Alabama A&M University',
                'utexas.edu': 'University of Texas',
            };
            for (var _i = 0, _b = Object.entries(map); _i < _b.length; _i++) {
                var _c = _b[_i], key = _c[0], school = _c[1];
                if (domain === key || domain.endsWith(".".concat(key)))
                    return school;
            }
            return undefined;
        };
        AuthService_1.prototype.sendVerificationEmail = function (email, token) {
            return __awaiter(this, void 0, void 0, function () {
                var verificationLink;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            verificationLink = this.getVerificationLink(token);
                            return [4 /*yield*/, this.sendEmail({
                                    to: email,
                                    subject: 'Verify your Internably account',
                                    text: "Welcome to Internably.\n\nVerify your email by opening this link:\n".concat(verificationLink, "\n\nThis link expires in 24 hours."),
                                    html: "\n        <div style=\"font-family:Arial,sans-serif;line-height:1.5;color:#111\">\n          <h2>Welcome to Internably</h2>\n          <p>Verify your email to activate your account.</p>\n          <p>\n            <a href=\"".concat(verificationLink, "\" style=\"display:inline-block;padding:10px 14px;background:#5BFF6A;color:#111;text-decoration:none;border-radius:8px;font-weight:700\">\n              Verify email\n            </a>\n          </p>\n          <p>If the button does not work, open this link:</p>\n          <p><a href=\"").concat(verificationLink, "\">").concat(verificationLink, "</a></p>\n          <p>This link expires in 24 hours.</p>\n        </div>\n      "),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, verificationLink];
                    }
                });
            });
        };
        AuthService_1.prototype.getGoogleTokenInfo = function (idToken) {
            return __awaiter(this, void 0, void 0, function () {
                var url, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = "https://oauth2.googleapis.com/tokeninfo?id_token=".concat(encodeURIComponent(idToken));
                            return [4 /*yield*/, fetch(url)];
                        case 1:
                            response = _a.sent();
                            if (!response.ok) {
                                throw new common_1.UnauthorizedException('Invalid Google token.');
                            }
                            return [4 /*yield*/, response.json()];
                        case 2: return [2 /*return*/, (_a.sent())];
                    }
                });
            });
        };
        AuthService_1.prototype.parseGoogleEmailVerified = function (value) {
            if (typeof value === 'boolean')
                return value;
            return value === 'true';
        };
        AuthService_1.prototype.createUniqueUsername = function (seedValue) {
            return __awaiter(this, void 0, void 0, function () {
                var cleaned, base, candidate, counter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cleaned = seedValue
                                .toLowerCase()
                                .replace(/[^a-z0-9._]/g, '')
                                .slice(0, 24);
                            base = cleaned || 'student';
                            candidate = base;
                            counter = 1;
                            _a.label = 1;
                        case 1: return [4 /*yield*/, this.prisma.user.findUnique({ where: { username: candidate } })];
                        case 2:
                            if (!_a.sent()) return [3 /*break*/, 3];
                            counter += 1;
                            candidate = "".concat(base).concat(counter);
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/, candidate];
                    }
                });
            });
        };
        AuthService_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedEmail, localPart, usernameSeed, username, exists, passwordHash, rawVerificationToken, verificationTokenHash, verificationTokenExpiresAt, university, user, verificationLink;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            normalizedEmail = this.normalizeEmail(dto.email);
                            if (!this.isEduEmail(normalizedEmail)) {
                                throw new common_1.BadRequestException(this.studentOnlyMessage);
                            }
                            localPart = (_a = normalizedEmail.split('@')[0]) !== null && _a !== void 0 ? _a : '';
                            usernameSeed = ((_b = dto.username) === null || _b === void 0 ? void 0 : _b.trim()) || localPart;
                            return [4 /*yield*/, this.createUniqueUsername(usernameSeed)];
                        case 1:
                            username = _c.sent();
                            return [4 /*yield*/, this.prisma.user.findFirst({
                                    where: { email: normalizedEmail },
                                })];
                        case 2:
                            exists = _c.sent();
                            if (exists)
                                throw new common_1.BadRequestException('Email already exists');
                            return [4 /*yield*/, bcrypt.hash(dto.password, 10)];
                        case 3:
                            passwordHash = _c.sent();
                            rawVerificationToken = this.generateVerificationToken();
                            verificationTokenHash = this.hashVerificationToken(rawVerificationToken);
                            verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                            university = this.inferUniversityFromEduEmail(normalizedEmail);
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        email: normalizedEmail,
                                        username: username,
                                        passwordHash: passwordHash,
                                        verificationTokenHash: verificationTokenHash,
                                        verificationTokenExpiresAt: verificationTokenExpiresAt,
                                        isApproved: false,
                                        profile: {
                                            create: __assign({ firstName: username, lastName: '' }, (university
                                                ? {
                                                    school: {
                                                        connectOrCreate: {
                                                            where: { name: university },
                                                            create: { name: university },
                                                        },
                                                    },
                                                }
                                                : {})),
                                        },
                                    },
                                })];
                        case 4:
                            user = _c.sent();
                            return [4 /*yield*/, this.sendVerificationEmail(user.email, rawVerificationToken)];
                        case 5:
                            verificationLink = _c.sent();
                            return [2 /*return*/, {
                                    userId: user.id,
                                    requiresEmailVerification: true,
                                    requiresApproval: true,
                                    message: 'Check your .edu email to verify your Internably account.',
                                    verificationLink: process.env.NODE_ENV === 'production' ? undefined : verificationLink,
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.login = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedEmail, user, ok, tokens;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedEmail = this.normalizeEmail(dto.email);
                            return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: normalizedEmail } })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            return [4 /*yield*/, bcrypt.compare(dto.password, user.passwordHash)];
                        case 2:
                            ok = _a.sent();
                            if (!ok)
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            if (!user.isVerified) {
                                throw new common_1.UnauthorizedException('Email not verified. Check your .edu inbox and verify your account.');
                            }
                            if (!user.isApproved)
                                throw new common_1.UnauthorizedException('Application not approved yet');
                            return [4 /*yield*/, this.signTokens({ id: user.id, email: user.email, role: user.role })];
                        case 3:
                            tokens = _a.sent();
                            return [4 /*yield*/, this.createRefreshSession(user.id, tokens.refreshToken)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, __assign({ user: user }, tokens)];
                    }
                });
            });
        };
        AuthService_1.prototype.verifyEmail = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenHash, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tokenHash = this.hashVerificationToken(token);
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { verificationTokenHash: tokenHash },
                                })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('Invalid or expired verification token.');
                            }
                            if (!user.verificationTokenExpiresAt || user.verificationTokenExpiresAt < new Date()) {
                                throw new common_1.BadRequestException('Verification token has expired.');
                            }
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        isVerified: true,
                                        verificationTokenHash: null,
                                        verificationTokenExpiresAt: null,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: 'Email verified successfully. You can now log in.' }];
                    }
                });
            });
        };
        AuthService_1.prototype.resendVerificationEmail = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedEmail, user, rawVerificationToken, verificationTokenHash, verificationTokenExpiresAt, verificationLink;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedEmail = this.normalizeEmail(email);
                            return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: normalizedEmail } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, { message: 'If that email exists, a verification link has been sent.' }];
                            }
                            if (user.isVerified) {
                                return [2 /*return*/, { message: 'Email is already verified. Please log in.' }];
                            }
                            rawVerificationToken = this.generateVerificationToken();
                            verificationTokenHash = this.hashVerificationToken(rawVerificationToken);
                            verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        verificationTokenHash: verificationTokenHash,
                                        verificationTokenExpiresAt: verificationTokenExpiresAt,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.sendVerificationEmail(normalizedEmail, rawVerificationToken)];
                        case 3:
                            verificationLink = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Verification email sent. Check your .edu inbox.',
                                    verificationLink: process.env.NODE_ENV === 'production' ? undefined : verificationLink,
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.googleAuth = function (idToken) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenInfo, normalizedEmail, emailVerified, configuredClientIds, localPart, user, username, passwordHash, inferredUniversity, displayName, fallbackFirstName, fallbackLastName, tokens;
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            if (!idToken) {
                                throw new common_1.BadRequestException('Google idToken is required.');
                            }
                            return [4 /*yield*/, this.getGoogleTokenInfo(idToken)];
                        case 1:
                            tokenInfo = _j.sent();
                            normalizedEmail = this.normalizeEmail((_a = tokenInfo.email) !== null && _a !== void 0 ? _a : '');
                            emailVerified = this.parseGoogleEmailVerified(tokenInfo.email_verified);
                            if (!normalizedEmail || !emailVerified) {
                                throw new common_1.UnauthorizedException('Google account email is not verified.');
                            }
                            if (!this.isEduEmail(normalizedEmail)) {
                                throw new common_1.BadRequestException(this.studentOnlyMessage);
                            }
                            configuredClientIds = (process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_CLIENT_ID || '')
                                .split(',')
                                .map(function (value) { return value.trim(); })
                                .filter(Boolean);
                            if (configuredClientIds.length > 0 && !configuredClientIds.includes((_b = tokenInfo.aud) !== null && _b !== void 0 ? _b : '')) {
                                throw new common_1.UnauthorizedException('Google token audience mismatch.');
                            }
                            localPart = (_c = normalizedEmail.split('@')[0]) !== null && _c !== void 0 ? _c : 'student';
                            return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: normalizedEmail } })];
                        case 2:
                            user = _j.sent();
                            if (!!user) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.createUniqueUsername(localPart)];
                        case 3:
                            username = _j.sent();
                            return [4 /*yield*/, bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10)];
                        case 4:
                            passwordHash = _j.sent();
                            inferredUniversity = this.inferUniversityFromEduEmail(normalizedEmail);
                            displayName = (_e = (_d = tokenInfo.name) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : '';
                            fallbackFirstName = displayName.split(' ')[0] || localPart;
                            fallbackLastName = displayName.split(' ').slice(1).join(' ') || '';
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        email: normalizedEmail,
                                        username: username,
                                        passwordHash: passwordHash,
                                        isVerified: true,
                                        isApproved: true,
                                        profile: {
                                            create: __assign({ firstName: ((_f = tokenInfo.given_name) === null || _f === void 0 ? void 0 : _f.trim()) || fallbackFirstName, lastName: ((_g = tokenInfo.family_name) === null || _g === void 0 ? void 0 : _g.trim()) || fallbackLastName, avatarUrl: (_h = tokenInfo.picture) !== null && _h !== void 0 ? _h : null }, (inferredUniversity
                                                ? {
                                                    school: {
                                                        connectOrCreate: {
                                                            where: { name: inferredUniversity },
                                                            create: { name: inferredUniversity },
                                                        },
                                                    },
                                                }
                                                : {})),
                                        },
                                    },
                                })];
                        case 5:
                            user = _j.sent();
                            _j.label = 6;
                        case 6:
                            if (!!user.isVerified) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { isVerified: true },
                                })];
                        case 7:
                            _j.sent();
                            user.isVerified = true;
                            _j.label = 8;
                        case 8:
                            if (!!user.isApproved) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { isApproved: true },
                                })];
                        case 9:
                            _j.sent();
                            user.isApproved = true;
                            _j.label = 10;
                        case 10: return [4 /*yield*/, this.signTokens({ id: user.id, email: user.email, role: user.role })];
                        case 11:
                            tokens = _j.sent();
                            return [4 /*yield*/, this.createRefreshSession(user.id, tokens.refreshToken)];
                        case 12:
                            _j.sent();
                            return [2 /*return*/, __assign({ user: user }, tokens)];
                    }
                });
            });
        };
        AuthService_1.prototype.refresh = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, match, tokens, _a, _b, _c, _d, _e, error_1;
                var _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _h.trys.push([0, 9, , 10]);
                            return [4 /*yield*/, this.jwtService.verifyAsync(refreshToken, { secret: this.getRefreshSecret() })];
                        case 1:
                            payload = _h.sent();
                            return [4 /*yield*/, this.findMatchingActiveRefreshSession(payload.sub, refreshToken)];
                        case 2:
                            match = _h.sent();
                            if (!!match) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.detectRefreshTokenReuse(payload.sub, refreshToken)];
                        case 3:
                            _h.sent();
                            throw new common_1.UnauthorizedException('Invalid refresh token');
                        case 4: return [4 /*yield*/, this.signTokens({ id: payload.sub, email: payload.email, role: payload.role })];
                        case 5:
                            tokens = _h.sent();
                            _b = (_a = this.prisma).$transaction;
                            _c = [this.prisma.refreshToken.update({
                                    where: { id: match.id },
                                    data: { revokedAt: new Date() },
                                })];
                            _e = (_d = this.prisma.refreshToken).create;
                            _f = {};
                            _g = {
                                userId: payload.sub
                            };
                            return [4 /*yield*/, bcrypt.hash(tokens.refreshToken, 10)];
                        case 6:
                            _g.tokenHash = _h.sent();
                            return [4 /*yield*/, this.refreshTokenExpiresAt(tokens.refreshToken)];
                        case 7: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                                    _e.apply(_d, [(_f.data = (_g.expiresAt = _h.sent(),
                                            _g),
                                            _f)])
                                ])])];
                        case 8:
                            _h.sent();
                            return [2 /*return*/, tokens];
                        case 9:
                            error_1 = _h.sent();
                            if (error_1 instanceof common_1.UnauthorizedException)
                                throw error_1;
                            throw new common_1.UnauthorizedException('Invalid refresh token');
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.logout = function (userId, refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var sessions, _i, sessions_2, session, match;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.refreshToken.findMany({ where: { userId: userId, revokedAt: null } })];
                        case 1:
                            sessions = _a.sent();
                            _i = 0, sessions_2 = sessions;
                            _a.label = 2;
                        case 2:
                            if (!(_i < sessions_2.length)) return [3 /*break*/, 6];
                            session = sessions_2[_i];
                            return [4 /*yield*/, bcrypt.compare(refreshToken, session.tokenHash)];
                        case 3:
                            match = _a.sent();
                            if (!match) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.refreshToken.update({ where: { id: session.id }, data: { revokedAt: new Date() } })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                        case 5:
                            _i++;
                            return [3 /*break*/, 2];
                        case 6: return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        AuthService_1.prototype.me = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.user.findUnique({
                            where: { id: userId },
                            include: { profile: true },
                        })];
                });
            });
        };
        AuthService_1.prototype.forgotPassword = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var user, token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({ where: { email: email } })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, { message: 'If that email exists, reset instructions were sent.' }];
                            return [4 /*yield*/, this.jwtService.signAsync({ sub: user.id, type: 'password-reset' }, { secret: process.env.JWT_ACCESS_SECRET || 'change_me_access', expiresIn: '30m' })];
                        case 2:
                            token = _a.sent();
                            return [2 /*return*/, { message: 'Password reset token generated (MVP)', token: token }];
                    }
                });
            });
        };
        AuthService_1.prototype.resetPassword = function (token, newPassword) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, passwordHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.jwtService.verifyAsync(token, {
                                secret: process.env.JWT_ACCESS_SECRET || 'change_me_access',
                            })];
                        case 1:
                            payload = _a.sent();
                            if (payload.type !== 'password-reset')
                                throw new common_1.UnauthorizedException('Invalid token type');
                            return [4 /*yield*/, bcrypt.hash(newPassword, 10)];
                        case 2:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({ where: { id: payload.sub }, data: { passwordHash: passwordHash } })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: 'Password updated' }];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
