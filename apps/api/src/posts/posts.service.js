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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var PostsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PostsService = _classThis = /** @class */ (function () {
        function PostsService_1(prisma, notificationsService) {
            this.prisma = prisma;
            this.notificationsService = notificationsService;
        }
        PostsService_1.prototype.feed = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var connections, connectedIds, _i, connections_1, connection, memberships, groupIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.connection.findMany({
                                where: { OR: [{ userAId: userId }, { userBId: userId }] },
                            })];
                        case 1:
                            connections = _a.sent();
                            connectedIds = new Set([userId]);
                            for (_i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
                                connection = connections_1[_i];
                                connectedIds.add(connection.userAId === userId ? connection.userBId : connection.userAId);
                            }
                            return [4 /*yield*/, this.prisma.groupMember.findMany({ where: { userId: userId }, select: { groupId: true } })];
                        case 2:
                            memberships = _a.sent();
                            groupIds = memberships.map(function (m) { return m.groupId; });
                            return [2 /*return*/, this.prisma.post.findMany({
                                    where: {
                                        OR: [
                                            { authorId: { in: __spreadArray([], connectedIds, true) } },
                                            { groupId: { in: groupIds } },
                                        ],
                                    },
                                    include: {
                                        author: { include: { profile: true } },
                                        group: true,
                                        _count: { select: { likes: true, comments: true } },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                    take: 100,
                                })];
                    }
                });
            });
        };
        PostsService_1.prototype.create = function (userId, dto) {
            return this.prisma.post.create({
                data: {
                    authorId: userId,
                    content: dto.content,
                    imageUrl: dto.imageUrl,
                    groupId: dto.groupId,
                },
                include: {
                    author: { include: { profile: true } },
                    group: true,
                },
            });
        };
        PostsService_1.prototype.getById = function (id) {
            return this.prisma.post.findUnique({
                where: { id: id },
                include: {
                    author: { include: { profile: true } },
                    _count: { select: { likes: true, comments: true } },
                },
            });
        };
        PostsService_1.prototype.update = function (postId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.post.findUnique({ where: { id: postId } })];
                        case 1:
                            post = _a.sent();
                            if (!post)
                                throw new common_1.NotFoundException('Post not found');
                            if (post.authorId !== userId)
                                throw new common_1.ForbiddenException('Not your post');
                            return [2 /*return*/, this.prisma.post.update({ where: { id: postId }, data: dto })];
                    }
                });
            });
        };
        PostsService_1.prototype.delete = function (postId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var post;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.post.findUnique({ where: { id: postId } })];
                        case 1:
                            post = _a.sent();
                            if (!post)
                                throw new common_1.NotFoundException('Post not found');
                            if (post.authorId !== userId)
                                throw new common_1.ForbiddenException('Not your post');
                            return [4 /*yield*/, this.prisma.post.delete({ where: { id: postId } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        PostsService_1.prototype.like = function (postId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var post, existing, like;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.post.findUnique({
                                where: { id: postId },
                                select: { authorId: true },
                            })];
                        case 1:
                            post = _a.sent();
                            if (!post)
                                throw new common_1.NotFoundException('Post not found');
                            return [4 /*yield*/, this.prisma.like.findUnique({
                                    where: { postId_userId: { postId: postId, userId: userId } },
                                })];
                        case 2:
                            existing = _a.sent();
                            if (existing)
                                return [2 /*return*/, existing];
                            return [4 /*yield*/, this.prisma.like.create({
                                    data: { postId: postId, userId: userId },
                                })];
                        case 3:
                            like = _a.sent();
                            if (!(post.authorId !== userId)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.notificationsService.create(post.authorId, client_1.NotificationType.POST_LIKE, 'New like', 'Someone liked your post.', postId, { kind: 'post_like', postId: postId })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/, like];
                    }
                });
            });
        };
        PostsService_1.prototype.unlike = function (postId, userId) {
            return this.prisma.like.deleteMany({ where: { postId: postId, userId: userId } });
        };
        PostsService_1.prototype.comment = function (postId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var post, comment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.post.findUnique({
                                where: { id: postId },
                                select: { authorId: true },
                            })];
                        case 1:
                            post = _a.sent();
                            if (!post)
                                throw new common_1.NotFoundException('Post not found');
                            return [4 /*yield*/, this.prisma.comment.create({
                                    data: {
                                        postId: postId,
                                        authorId: userId,
                                        content: dto.content,
                                    },
                                    include: { author: { include: { profile: true } } },
                                })];
                        case 2:
                            comment = _a.sent();
                            if (!(post.authorId !== userId)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.notificationsService.create(post.authorId, client_1.NotificationType.POST_COMMENT, 'New comment', 'Someone commented on your post.', postId, { kind: 'post_comment', postId: postId })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, comment];
                    }
                });
            });
        };
        PostsService_1.prototype.comments = function (postId) {
            return this.prisma.comment.findMany({
                where: { postId: postId },
                include: { author: { include: { profile: true } } },
                orderBy: { createdAt: 'asc' },
            });
        };
        return PostsService_1;
    }());
    __setFunctionName(_classThis, "PostsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PostsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PostsService = _classThis;
}();
exports.PostsService = PostsService;
