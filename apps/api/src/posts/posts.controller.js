"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var PostsController = function () {
    var _classDecorators = [(0, common_1.Controller)('posts'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _feed_decorators;
    var _create_decorators;
    var _byId_decorators;
    var _update_decorators;
    var _delete_decorators;
    var _like_decorators;
    var _unlike_decorators;
    var _comment_decorators;
    var _comments_decorators;
    var PostsController = _classThis = /** @class */ (function () {
        function PostsController_1(postsService) {
            this.postsService = (__runInitializers(this, _instanceExtraInitializers), postsService);
        }
        PostsController_1.prototype.feed = function (user) {
            return this.postsService.feed(user.sub);
        };
        PostsController_1.prototype.create = function (user, dto) {
            return this.postsService.create(user.sub, dto);
        };
        PostsController_1.prototype.byId = function (id) {
            return this.postsService.getById(id);
        };
        PostsController_1.prototype.update = function (id, user, dto) {
            return this.postsService.update(id, user.sub, dto);
        };
        PostsController_1.prototype.delete = function (id, user) {
            return this.postsService.delete(id, user.sub);
        };
        PostsController_1.prototype.like = function (id, user) {
            return this.postsService.like(id, user.sub);
        };
        PostsController_1.prototype.unlike = function (id, user) {
            return this.postsService.unlike(id, user.sub);
        };
        PostsController_1.prototype.comment = function (id, user, dto) {
            return this.postsService.comment(id, user.sub, dto);
        };
        PostsController_1.prototype.comments = function (id) {
            return this.postsService.comments(id);
        };
        return PostsController_1;
    }());
    __setFunctionName(_classThis, "PostsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _feed_decorators = [(0, common_1.Get)('feed')];
        _create_decorators = [(0, common_1.Post)()];
        _byId_decorators = [(0, common_1.Get)(':id')];
        _update_decorators = [(0, common_1.Patch)(':id')];
        _delete_decorators = [(0, common_1.Delete)(':id')];
        _like_decorators = [(0, common_1.Post)(':id/like')];
        _unlike_decorators = [(0, common_1.Delete)(':id/like')];
        _comment_decorators = [(0, common_1.Post)(':id/comments')];
        _comments_decorators = [(0, common_1.Get)(':id/comments')];
        __esDecorate(_classThis, null, _feed_decorators, { kind: "method", name: "feed", static: false, private: false, access: { has: function (obj) { return "feed" in obj; }, get: function (obj) { return obj.feed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _byId_decorators, { kind: "method", name: "byId", static: false, private: false, access: { has: function (obj) { return "byId" in obj; }, get: function (obj) { return obj.byId; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _delete_decorators, { kind: "method", name: "delete", static: false, private: false, access: { has: function (obj) { return "delete" in obj; }, get: function (obj) { return obj.delete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _like_decorators, { kind: "method", name: "like", static: false, private: false, access: { has: function (obj) { return "like" in obj; }, get: function (obj) { return obj.like; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unlike_decorators, { kind: "method", name: "unlike", static: false, private: false, access: { has: function (obj) { return "unlike" in obj; }, get: function (obj) { return obj.unlike; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _comment_decorators, { kind: "method", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _comments_decorators, { kind: "method", name: "comments", static: false, private: false, access: { has: function (obj) { return "comments" in obj; }, get: function (obj) { return obj.comments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PostsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PostsController = _classThis;
}();
exports.PostsController = PostsController;
