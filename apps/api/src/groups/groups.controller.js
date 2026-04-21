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
exports.GroupsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var GroupsController = function () {
    var _classDecorators = [(0, common_1.Controller)('groups'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _list_decorators;
    var _create_decorators;
    var _detail_decorators;
    var _join_decorators;
    var _leave_decorators;
    var _members_decorators;
    var _posts_decorators;
    var GroupsController = _classThis = /** @class */ (function () {
        function GroupsController_1(groupsService) {
            this.groupsService = (__runInitializers(this, _instanceExtraInitializers), groupsService);
        }
        GroupsController_1.prototype.list = function (type, q) {
            return this.groupsService.list({ type: type, q: q });
        };
        GroupsController_1.prototype.create = function (user, dto) {
            return this.groupsService.create(user.sub, dto);
        };
        GroupsController_1.prototype.detail = function (id) {
            return this.groupsService.detail(id);
        };
        GroupsController_1.prototype.join = function (id, user) {
            return this.groupsService.join(id, user.sub);
        };
        GroupsController_1.prototype.leave = function (id, user) {
            return this.groupsService.leave(id, user.sub);
        };
        GroupsController_1.prototype.members = function (id) {
            return this.groupsService.members(id);
        };
        GroupsController_1.prototype.posts = function (id) {
            return this.groupsService.groupPosts(id);
        };
        return GroupsController_1;
    }());
    __setFunctionName(_classThis, "GroupsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _list_decorators = [(0, common_1.Get)()];
        _create_decorators = [(0, common_1.Post)()];
        _detail_decorators = [(0, common_1.Get)(':id')];
        _join_decorators = [(0, common_1.Post)(':id/join')];
        _leave_decorators = [(0, common_1.Post)(':id/leave')];
        _members_decorators = [(0, common_1.Get)(':id/members')];
        _posts_decorators = [(0, common_1.Get)(':id/posts')];
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _detail_decorators, { kind: "method", name: "detail", static: false, private: false, access: { has: function (obj) { return "detail" in obj; }, get: function (obj) { return obj.detail; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _join_decorators, { kind: "method", name: "join", static: false, private: false, access: { has: function (obj) { return "join" in obj; }, get: function (obj) { return obj.join; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _leave_decorators, { kind: "method", name: "leave", static: false, private: false, access: { has: function (obj) { return "leave" in obj; }, get: function (obj) { return obj.leave; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _members_decorators, { kind: "method", name: "members", static: false, private: false, access: { has: function (obj) { return "members" in obj; }, get: function (obj) { return obj.members; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _posts_decorators, { kind: "method", name: "posts", static: false, private: false, access: { has: function (obj) { return "posts" in obj; }, get: function (obj) { return obj.posts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GroupsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GroupsController = _classThis;
}();
exports.GroupsController = GroupsController;
