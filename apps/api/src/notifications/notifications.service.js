"use strict";
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
exports.NotificationsService = void 0;
var common_1 = require("@nestjs/common");
var NotificationsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NotificationsService = _classThis = /** @class */ (function () {
        function NotificationsService_1(prisma) {
            this.prisma = prisma;
        }
        NotificationsService_1.prototype.list = function (userId) {
            return this.prisma.notification.findMany({
                where: { userId: userId },
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
        };
        NotificationsService_1.prototype.read = function (userId, id) {
            return this.prisma.notification.updateMany({
                where: { id: id, userId: userId },
                data: { isRead: true },
            });
        };
        NotificationsService_1.prototype.readAll = function (userId) {
            return this.prisma.notification.updateMany({
                where: { userId: userId, isRead: false },
                data: { isRead: true },
            });
        };
        NotificationsService_1.prototype.registerPushToken = function (userId, token, platform) {
            return this.prisma.pushDevice.upsert({
                where: { token: token },
                update: {
                    userId: userId,
                    platform: platform,
                    lastSeenAt: new Date(),
                },
                create: {
                    userId: userId,
                    token: token,
                    platform: platform,
                },
            });
        };
        NotificationsService_1.prototype.removePushToken = function (userId, token) {
            return this.prisma.pushDevice.deleteMany({
                where: { userId: userId, token: token },
            });
        };
        NotificationsService_1.prototype.create = function (userId, type, title, body, entityId, pushData) {
            return __awaiter(this, void 0, void 0, function () {
                var notification;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.notification.create({
                                data: {
                                    userId: userId,
                                    type: type,
                                    title: title,
                                    body: body,
                                    entityId: entityId,
                                },
                            })];
                        case 1:
                            notification = _a.sent();
                            return [4 /*yield*/, this.sendPushToUsers([userId], title, body, pushData)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, notification];
                    }
                });
            });
        };
        NotificationsService_1.prototype.createMany = function (entries) {
            return __awaiter(this, void 0, void 0, function () {
                var created, _i, entries_1, entry;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (entries.length === 0)
                                return [2 /*return*/, { count: 0 }];
                            return [4 /*yield*/, Promise.all(entries.map(function (entry) {
                                    return _this.prisma.notification.create({
                                        data: {
                                            userId: entry.userId,
                                            type: entry.type,
                                            title: entry.title,
                                            body: entry.body,
                                            entityId: entry.entityId,
                                        },
                                    });
                                }))];
                        case 1:
                            created = _a.sent();
                            _i = 0, entries_1 = entries;
                            _a.label = 2;
                        case 2:
                            if (!(_i < entries_1.length)) return [3 /*break*/, 5];
                            entry = entries_1[_i];
                            return [4 /*yield*/, this.sendPushToUsers([entry.userId], entry.title, entry.body, entry.pushData)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, { count: created.length }];
                    }
                });
            });
        };
        NotificationsService_1.prototype.sendPushToUsers = function (userIds, title, body, data) {
            return __awaiter(this, void 0, void 0, function () {
                var provider, devices, tokens, messages, headers, accessToken, response, text, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (userIds.length === 0)
                                return [2 /*return*/];
                            provider = (process.env.PUSH_PROVIDER || 'mock').toLowerCase();
                            return [4 /*yield*/, this.prisma.pushDevice.findMany({
                                    where: { userId: { in: userIds } },
                                    select: { token: true },
                                })];
                        case 1:
                            devices = _a.sent();
                            tokens = devices.map(function (d) { return d.token; });
                            if (tokens.length === 0)
                                return [2 /*return*/];
                            if (provider !== 'expo') {
                                console.log("[Push:".concat(provider, "]"), { tokensCount: tokens.length, title: title, body: body, data: data });
                                return [2 /*return*/];
                            }
                            messages = tokens.map(function (to) { return ({
                                to: to,
                                sound: 'default',
                                title: title,
                                body: body,
                                data: data !== null && data !== void 0 ? data : {},
                            }); });
                            headers = {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                            };
                            accessToken = process.env.EXPO_PUSH_ACCESS_TOKEN;
                            if (accessToken) {
                                headers.Authorization = "Bearer ".concat(accessToken);
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 6, , 7]);
                            return [4 /*yield*/, fetch('https://exp.host/--/api/v2/push/send', {
                                    method: 'POST',
                                    headers: headers,
                                    body: JSON.stringify(messages),
                                })];
                        case 3:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 5];
                            return [4 /*yield*/, response.text()];
                        case 4:
                            text = _a.sent();
                            console.error('[Push:expo] failed', response.status, text);
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_1 = _a.sent();
                            console.error('[Push:expo] error', error_1);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        return NotificationsService_1;
    }());
    __setFunctionName(_classThis, "NotificationsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationsService = _classThis;
}();
exports.NotificationsService = NotificationsService;
