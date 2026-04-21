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
exports.AdminController = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var AdminController = function () {
    var _classDecorators = [(0, common_1.Controller)('admin'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MODERATOR)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _reports_decorators;
    var _removePost_decorators;
    var _groups_decorators;
    var _verify_decorators;
    var AdminController = _classThis = /** @class */ (function () {
        function AdminController_1(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        AdminController_1.prototype.reports = function () {
            return this.adminService.reports();
        };
        AdminController_1.prototype.removePost = function (id) {
            return this.adminService.removePost(id);
        };
        AdminController_1.prototype.groups = function () {
            return this.adminService.manageGroups();
        };
        AdminController_1.prototype.verify = function (id, body) {
            return this.adminService.verifyMember(id, body.isVerified);
        };
        return AdminController_1;
    }());
    __setFunctionName(_classThis, "AdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _reports_decorators = [(0, common_1.Get)('reports')];
        _removePost_decorators = [(0, common_1.Delete)('posts/:id')];
        _groups_decorators = [(0, common_1.Get)('groups')];
        _verify_decorators = [(0, common_1.Patch)('members/:id/verify')];
        __esDecorate(_classThis, null, _reports_decorators, { kind: "method", name: "reports", static: false, private: false, access: { has: function (obj) { return "reports" in obj; }, get: function (obj) { return obj.reports; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removePost_decorators, { kind: "method", name: "removePost", static: false, private: false, access: { has: function (obj) { return "removePost" in obj; }, get: function (obj) { return obj.removePost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _groups_decorators, { kind: "method", name: "groups", static: false, private: false, access: { has: function (obj) { return "groups" in obj; }, get: function (obj) { return obj.groups; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verify_decorators, { kind: "method", name: "verify", static: false, private: false, access: { has: function (obj) { return "verify" in obj; }, get: function (obj) { return obj.verify; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
}();
exports.AdminController = AdminController;
