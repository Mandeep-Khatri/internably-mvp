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
exports.UpdateMeDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateMeDto = function () {
    var _a;
    var _firstName_decorators;
    var _firstName_initializers = [];
    var _firstName_extraInitializers = [];
    var _lastName_decorators;
    var _lastName_initializers = [];
    var _lastName_extraInitializers = [];
    var _pronouns_decorators;
    var _pronouns_initializers = [];
    var _pronouns_extraInitializers = [];
    var _headline_decorators;
    var _headline_initializers = [];
    var _headline_extraInitializers = [];
    var _bio_decorators;
    var _bio_initializers = [];
    var _bio_extraInitializers = [];
    var _school_decorators;
    var _school_initializers = [];
    var _school_extraInitializers = [];
    var _major_decorators;
    var _major_initializers = [];
    var _major_extraInitializers = [];
    var _degree_decorators;
    var _degree_initializers = [];
    var _degree_extraInitializers = [];
    var _graduationYear_decorators;
    var _graduationYear_initializers = [];
    var _graduationYear_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _internshipCompany_decorators;
    var _internshipCompany_initializers = [];
    var _internshipCompany_extraInitializers = [];
    var _linkedinUrl_decorators;
    var _linkedinUrl_initializers = [];
    var _linkedinUrl_extraInitializers = [];
    var _avatarUrl_decorators;
    var _avatarUrl_initializers = [];
    var _avatarUrl_extraInitializers = [];
    var _bannerUrl_decorators;
    var _bannerUrl_initializers = [];
    var _bannerUrl_extraInitializers = [];
    var _openToNetwork_decorators;
    var _openToNetwork_initializers = [];
    var _openToNetwork_extraInitializers = [];
    var _openToInternship_decorators;
    var _openToInternship_initializers = [];
    var _openToInternship_extraInitializers = [];
    var _interests_decorators;
    var _interests_initializers = [];
    var _interests_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateMeDto() {
                this.firstName = __runInitializers(this, _firstName_initializers, void 0);
                this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
                this.pronouns = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _pronouns_initializers, void 0));
                this.headline = (__runInitializers(this, _pronouns_extraInitializers), __runInitializers(this, _headline_initializers, void 0));
                this.bio = (__runInitializers(this, _headline_extraInitializers), __runInitializers(this, _bio_initializers, void 0));
                this.school = (__runInitializers(this, _bio_extraInitializers), __runInitializers(this, _school_initializers, void 0));
                this.major = (__runInitializers(this, _school_extraInitializers), __runInitializers(this, _major_initializers, void 0));
                this.degree = (__runInitializers(this, _major_extraInitializers), __runInitializers(this, _degree_initializers, void 0));
                this.graduationYear = (__runInitializers(this, _degree_extraInitializers), __runInitializers(this, _graduationYear_initializers, void 0));
                this.city = (__runInitializers(this, _graduationYear_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.internshipCompany = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _internshipCompany_initializers, void 0));
                this.linkedinUrl = (__runInitializers(this, _internshipCompany_extraInitializers), __runInitializers(this, _linkedinUrl_initializers, void 0));
                this.avatarUrl = (__runInitializers(this, _linkedinUrl_extraInitializers), __runInitializers(this, _avatarUrl_initializers, void 0));
                this.bannerUrl = (__runInitializers(this, _avatarUrl_extraInitializers), __runInitializers(this, _bannerUrl_initializers, void 0));
                this.openToNetwork = (__runInitializers(this, _bannerUrl_extraInitializers), __runInitializers(this, _openToNetwork_initializers, void 0));
                this.openToInternship = (__runInitializers(this, _openToNetwork_extraInitializers), __runInitializers(this, _openToInternship_initializers, void 0));
                this.interests = (__runInitializers(this, _openToInternship_extraInitializers), __runInitializers(this, _interests_initializers, void 0));
                __runInitializers(this, _interests_extraInitializers);
            }
            return UpdateMeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _firstName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _lastName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _pronouns_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _headline_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _bio_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _school_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _major_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _degree_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _graduationYear_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(2024), (0, class_validator_1.Max)(2035)];
            _city_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _internshipCompany_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _linkedinUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)()];
            _avatarUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)()];
            _bannerUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)()];
            _openToNetwork_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _openToInternship_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _interests_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: function (obj) { return "firstName" in obj; }, get: function (obj) { return obj.firstName; }, set: function (obj, value) { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: function (obj) { return "lastName" in obj; }, get: function (obj) { return obj.lastName; }, set: function (obj, value) { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _pronouns_decorators, { kind: "field", name: "pronouns", static: false, private: false, access: { has: function (obj) { return "pronouns" in obj; }, get: function (obj) { return obj.pronouns; }, set: function (obj, value) { obj.pronouns = value; } }, metadata: _metadata }, _pronouns_initializers, _pronouns_extraInitializers);
            __esDecorate(null, null, _headline_decorators, { kind: "field", name: "headline", static: false, private: false, access: { has: function (obj) { return "headline" in obj; }, get: function (obj) { return obj.headline; }, set: function (obj, value) { obj.headline = value; } }, metadata: _metadata }, _headline_initializers, _headline_extraInitializers);
            __esDecorate(null, null, _bio_decorators, { kind: "field", name: "bio", static: false, private: false, access: { has: function (obj) { return "bio" in obj; }, get: function (obj) { return obj.bio; }, set: function (obj, value) { obj.bio = value; } }, metadata: _metadata }, _bio_initializers, _bio_extraInitializers);
            __esDecorate(null, null, _school_decorators, { kind: "field", name: "school", static: false, private: false, access: { has: function (obj) { return "school" in obj; }, get: function (obj) { return obj.school; }, set: function (obj, value) { obj.school = value; } }, metadata: _metadata }, _school_initializers, _school_extraInitializers);
            __esDecorate(null, null, _major_decorators, { kind: "field", name: "major", static: false, private: false, access: { has: function (obj) { return "major" in obj; }, get: function (obj) { return obj.major; }, set: function (obj, value) { obj.major = value; } }, metadata: _metadata }, _major_initializers, _major_extraInitializers);
            __esDecorate(null, null, _degree_decorators, { kind: "field", name: "degree", static: false, private: false, access: { has: function (obj) { return "degree" in obj; }, get: function (obj) { return obj.degree; }, set: function (obj, value) { obj.degree = value; } }, metadata: _metadata }, _degree_initializers, _degree_extraInitializers);
            __esDecorate(null, null, _graduationYear_decorators, { kind: "field", name: "graduationYear", static: false, private: false, access: { has: function (obj) { return "graduationYear" in obj; }, get: function (obj) { return obj.graduationYear; }, set: function (obj, value) { obj.graduationYear = value; } }, metadata: _metadata }, _graduationYear_initializers, _graduationYear_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _internshipCompany_decorators, { kind: "field", name: "internshipCompany", static: false, private: false, access: { has: function (obj) { return "internshipCompany" in obj; }, get: function (obj) { return obj.internshipCompany; }, set: function (obj, value) { obj.internshipCompany = value; } }, metadata: _metadata }, _internshipCompany_initializers, _internshipCompany_extraInitializers);
            __esDecorate(null, null, _linkedinUrl_decorators, { kind: "field", name: "linkedinUrl", static: false, private: false, access: { has: function (obj) { return "linkedinUrl" in obj; }, get: function (obj) { return obj.linkedinUrl; }, set: function (obj, value) { obj.linkedinUrl = value; } }, metadata: _metadata }, _linkedinUrl_initializers, _linkedinUrl_extraInitializers);
            __esDecorate(null, null, _avatarUrl_decorators, { kind: "field", name: "avatarUrl", static: false, private: false, access: { has: function (obj) { return "avatarUrl" in obj; }, get: function (obj) { return obj.avatarUrl; }, set: function (obj, value) { obj.avatarUrl = value; } }, metadata: _metadata }, _avatarUrl_initializers, _avatarUrl_extraInitializers);
            __esDecorate(null, null, _bannerUrl_decorators, { kind: "field", name: "bannerUrl", static: false, private: false, access: { has: function (obj) { return "bannerUrl" in obj; }, get: function (obj) { return obj.bannerUrl; }, set: function (obj, value) { obj.bannerUrl = value; } }, metadata: _metadata }, _bannerUrl_initializers, _bannerUrl_extraInitializers);
            __esDecorate(null, null, _openToNetwork_decorators, { kind: "field", name: "openToNetwork", static: false, private: false, access: { has: function (obj) { return "openToNetwork" in obj; }, get: function (obj) { return obj.openToNetwork; }, set: function (obj, value) { obj.openToNetwork = value; } }, metadata: _metadata }, _openToNetwork_initializers, _openToNetwork_extraInitializers);
            __esDecorate(null, null, _openToInternship_decorators, { kind: "field", name: "openToInternship", static: false, private: false, access: { has: function (obj) { return "openToInternship" in obj; }, get: function (obj) { return obj.openToInternship; }, set: function (obj, value) { obj.openToInternship = value; } }, metadata: _metadata }, _openToInternship_initializers, _openToInternship_extraInitializers);
            __esDecorate(null, null, _interests_decorators, { kind: "field", name: "interests", static: false, private: false, access: { has: function (obj) { return "interests" in obj; }, get: function (obj) { return obj.interests; }, set: function (obj, value) { obj.interests = value; } }, metadata: _metadata }, _interests_initializers, _interests_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateMeDto = UpdateMeDto;
