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
exports.ConnectionsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var ConnectionsController = function () {
    var _classDecorators = [(0, common_1.Controller)('connections'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _request_decorators;
    var _accept_decorators;
    var _decline_decorators;
    var _remove_decorators;
    var _list_decorators;
    var _incoming_decorators;
    var _outgoing_decorators;
    var ConnectionsController = _classThis = /** @class */ (function () {
        function ConnectionsController_1(connectionsService) {
            this.connectionsService = (__runInitializers(this, _instanceExtraInitializers), connectionsService);
        }
        ConnectionsController_1.prototype.request = function (user, userId) {
            return this.connectionsService.request(user.sub, userId);
        };
        ConnectionsController_1.prototype.accept = function (user, requestId) {
            return this.connectionsService.accept(user.sub, requestId);
        };
        ConnectionsController_1.prototype.decline = function (user, requestId) {
            return this.connectionsService.decline(user.sub, requestId);
        };
        ConnectionsController_1.prototype.remove = function (user, userId) {
            return this.connectionsService.remove(user.sub, userId);
        };
        ConnectionsController_1.prototype.list = function (user) {
            return this.connectionsService.list(user.sub);
        };
        ConnectionsController_1.prototype.incoming = function (user) {
            return this.connectionsService.incoming(user.sub);
        };
        ConnectionsController_1.prototype.outgoing = function (user) {
            return this.connectionsService.outgoing(user.sub);
        };
        return ConnectionsController_1;
    }());
    __setFunctionName(_classThis, "ConnectionsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _request_decorators = [(0, common_1.Post)('request/:userId')];
        _accept_decorators = [(0, common_1.Post)('accept/:requestId')];
        _decline_decorators = [(0, common_1.Post)('decline/:requestId')];
        _remove_decorators = [(0, common_1.Delete)(':userId')];
        _list_decorators = [(0, common_1.Get)()];
        _incoming_decorators = [(0, common_1.Get)('requests/incoming')];
        _outgoing_decorators = [(0, common_1.Get)('requests/outgoing')];
        __esDecorate(_classThis, null, _request_decorators, { kind: "method", name: "request", static: false, private: false, access: { has: function (obj) { return "request" in obj; }, get: function (obj) { return obj.request; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _accept_decorators, { kind: "method", name: "accept", static: false, private: false, access: { has: function (obj) { return "accept" in obj; }, get: function (obj) { return obj.accept; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _decline_decorators, { kind: "method", name: "decline", static: false, private: false, access: { has: function (obj) { return "decline" in obj; }, get: function (obj) { return obj.decline; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _incoming_decorators, { kind: "method", name: "incoming", static: false, private: false, access: { has: function (obj) { return "incoming" in obj; }, get: function (obj) { return obj.incoming; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _outgoing_decorators, { kind: "method", name: "outgoing", static: false, private: false, access: { has: function (obj) { return "outgoing" in obj; }, get: function (obj) { return obj.outgoing; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConnectionsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConnectionsController = _classThis;
}();
exports.ConnectionsController = ConnectionsController;
