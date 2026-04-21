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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewApplicationDto = exports.SubmitApplicationDto = void 0;
var client_1 = require("@prisma/client");
var class_validator_1 = require("class-validator");
var SubmitApplicationDto = function () {
    var _a;
    var _firstName_decorators;
    var _firstName_initializers = [];
    var _firstName_extraInitializers = [];
    var _lastName_decorators;
    var _lastName_initializers = [];
    var _lastName_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _school_decorators;
    var _school_initializers = [];
    var _school_extraInitializers = [];
    var _graduationYear_decorators;
    var _graduationYear_initializers = [];
    var _graduationYear_extraInitializers = [];
    var _major_decorators;
    var _major_initializers = [];
    var _major_extraInitializers = [];
    var _internshipCompany_decorators;
    var _internshipCompany_initializers = [];
    var _internshipCompany_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _linkedinUrl_decorators;
    var _linkedinUrl_initializers = [];
    var _linkedinUrl_extraInitializers = [];
    var _proofOfEnrollmentUrl_decorators;
    var _proofOfEnrollmentUrl_initializers = [];
    var _proofOfEnrollmentUrl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SubmitApplicationDto() {
                this.firstName = __runInitializers(this, _firstName_initializers, void 0);
                this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
                this.email = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.school = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _school_initializers, void 0));
                this.graduationYear = (__runInitializers(this, _school_extraInitializers), __runInitializers(this, _graduationYear_initializers, void 0));
                this.major = (__runInitializers(this, _graduationYear_extraInitializers), __runInitializers(this, _major_initializers, void 0));
                this.internshipCompany = (__runInitializers(this, _major_extraInitializers), __runInitializers(this, _internshipCompany_initializers, void 0));
                this.city = (__runInitializers(this, _internshipCompany_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.linkedinUrl = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _linkedinUrl_initializers, void 0));
                this.proofOfEnrollmentUrl = (__runInitializers(this, _linkedinUrl_extraInitializers), __runInitializers(this, _proofOfEnrollmentUrl_initializers, void 0));
                __runInitializers(this, _proofOfEnrollmentUrl_extraInitializers);
            }
            return SubmitApplicationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _firstName_decorators = [(0, class_validator_1.IsString)()];
            _lastName_decorators = [(0, class_validator_1.IsString)()];
            _email_decorators = [(0, class_validator_1.IsEmail)()];
            _school_decorators = [(0, class_validator_1.IsString)()];
            _graduationYear_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(2024), (0, class_validator_1.Max)(2035)];
            _major_decorators = [(0, class_validator_1.IsString)()];
            _internshipCompany_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _city_decorators = [(0, class_validator_1.IsString)()];
            _linkedinUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)()];
            _proofOfEnrollmentUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: function (obj) { return "firstName" in obj; }, get: function (obj) { return obj.firstName; }, set: function (obj, value) { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: function (obj) { return "lastName" in obj; }, get: function (obj) { return obj.lastName; }, set: function (obj, value) { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _school_decorators, { kind: "field", name: "school", static: false, private: false, access: { has: function (obj) { return "school" in obj; }, get: function (obj) { return obj.school; }, set: function (obj, value) { obj.school = value; } }, metadata: _metadata }, _school_initializers, _school_extraInitializers);
            __esDecorate(null, null, _graduationYear_decorators, { kind: "field", name: "graduationYear", static: false, private: false, access: { has: function (obj) { return "graduationYear" in obj; }, get: function (obj) { return obj.graduationYear; }, set: function (obj, value) { obj.graduationYear = value; } }, metadata: _metadata }, _graduationYear_initializers, _graduationYear_extraInitializers);
            __esDecorate(null, null, _major_decorators, { kind: "field", name: "major", static: false, private: false, access: { has: function (obj) { return "major" in obj; }, get: function (obj) { return obj.major; }, set: function (obj, value) { obj.major = value; } }, metadata: _metadata }, _major_initializers, _major_extraInitializers);
            __esDecorate(null, null, _internshipCompany_decorators, { kind: "field", name: "internshipCompany", static: false, private: false, access: { has: function (obj) { return "internshipCompany" in obj; }, get: function (obj) { return obj.internshipCompany; }, set: function (obj, value) { obj.internshipCompany = value; } }, metadata: _metadata }, _internshipCompany_initializers, _internshipCompany_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _linkedinUrl_decorators, { kind: "field", name: "linkedinUrl", static: false, private: false, access: { has: function (obj) { return "linkedinUrl" in obj; }, get: function (obj) { return obj.linkedinUrl; }, set: function (obj, value) { obj.linkedinUrl = value; } }, metadata: _metadata }, _linkedinUrl_initializers, _linkedinUrl_extraInitializers);
            __esDecorate(null, null, _proofOfEnrollmentUrl_decorators, { kind: "field", name: "proofOfEnrollmentUrl", static: false, private: false, access: { has: function (obj) { return "proofOfEnrollmentUrl" in obj; }, get: function (obj) { return obj.proofOfEnrollmentUrl; }, set: function (obj, value) { obj.proofOfEnrollmentUrl = value; } }, metadata: _metadata }, _proofOfEnrollmentUrl_initializers, _proofOfEnrollmentUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SubmitApplicationDto = SubmitApplicationDto;
var ReviewApplicationDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _reviewNotes_decorators;
    var _reviewNotes_initializers = [];
    var _reviewNotes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReviewApplicationDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.reviewNotes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _reviewNotes_initializers, void 0));
                __runInitializers(this, _reviewNotes_extraInitializers);
            }
            return ReviewApplicationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsEnum)(client_1.ApplicationStatus)];
            _reviewNotes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _reviewNotes_decorators, { kind: "field", name: "reviewNotes", static: false, private: false, access: { has: function (obj) { return "reviewNotes" in obj; }, get: function (obj) { return obj.reviewNotes; }, set: function (obj, value) { obj.reviewNotes = value; } }, metadata: _metadata }, _reviewNotes_initializers, _reviewNotes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReviewApplicationDto = ReviewApplicationDto;
