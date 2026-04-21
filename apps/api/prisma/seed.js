"use strict";
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
var client_1 = require("@prisma/client");
var bcrypt = require("bcryptjs");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var schools, companies, interests, passwordHash, admin, demoUsers, groups, _i, _a, user, _b, _c, group, i, author, group, u1, u2, u3, convo, _d, demoUsers_1, user, profile, _e, _f, interest;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, prisma.like.deleteMany()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, prisma.comment.deleteMany()];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, prisma.post.deleteMany()];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, prisma.connection.deleteMany()];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, prisma.connectionRequest.deleteMany()];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, prisma.message.deleteMany()];
                case 6:
                    _g.sent();
                    return [4 /*yield*/, prisma.conversationMember.deleteMany()];
                case 7:
                    _g.sent();
                    return [4 /*yield*/, prisma.conversation.deleteMany()];
                case 8:
                    _g.sent();
                    return [4 /*yield*/, prisma.notification.deleteMany()];
                case 9:
                    _g.sent();
                    return [4 /*yield*/, prisma.groupMember.deleteMany()];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, prisma.pushDevice.deleteMany()];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, prisma.group.deleteMany()];
                case 12:
                    _g.sent();
                    return [4 /*yield*/, prisma.userInterest.deleteMany()];
                case 13:
                    _g.sent();
                    return [4 /*yield*/, prisma.interest.deleteMany()];
                case 14:
                    _g.sent();
                    return [4 /*yield*/, prisma.profile.deleteMany()];
                case 15:
                    _g.sent();
                    return [4 /*yield*/, prisma.application.deleteMany()];
                case 16:
                    _g.sent();
                    return [4 /*yield*/, prisma.refreshToken.deleteMany()];
                case 17:
                    _g.sent();
                    return [4 /*yield*/, prisma.school.deleteMany()];
                case 18:
                    _g.sent();
                    return [4 /*yield*/, prisma.company.deleteMany()];
                case 19:
                    _g.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 20:
                    _g.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.school.create({ data: { name: 'Georgia Tech', city: 'Atlanta', state: 'GA', isHBCU: false } }),
                            prisma.school.create({ data: { name: 'Alabama A&M University', city: 'Normal', state: 'AL', isHBCU: true } }),
                            prisma.school.create({ data: { name: 'Howard University', city: 'Washington', state: 'DC', isHBCU: true } }),
                            prisma.school.create({ data: { name: 'University of Georgia', city: 'Athens', state: 'GA', isHBCU: false } }),
                            prisma.school.create({ data: { name: 'Spelman College', city: 'Atlanta', state: 'GA', isHBCU: true } })
                        ])];
                case 21:
                    schools = _g.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.company.create({ data: { name: 'Southern Company', city: 'Atlanta' } }),
                            prisma.company.create({ data: { name: 'Microsoft', city: 'Redmond' } }),
                            prisma.company.create({ data: { name: 'Google', city: 'Mountain View' } }),
                            prisma.company.create({ data: { name: 'PwC', city: 'New York' } }),
                            prisma.company.create({ data: { name: 'Delta Air Lines', city: 'Atlanta' } })
                        ])];
                case 22:
                    companies = _g.sent();
                    return [4 /*yield*/, Promise.all(['Software Engineering', 'Product', 'Finance', 'AI/ML', 'Campus Leadership', 'Design', 'Consulting']
                            .map(function (name) { return prisma.interest.create({ data: { name: name } }); }))];
                case 23:
                    interests = _g.sent();
                    return [4 /*yield*/, bcrypt.hash('Password123!', 10)];
                case 24:
                    passwordHash = _g.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'admin@internably.com',
                                username: 'internably_admin',
                                passwordHash: passwordHash,
                                role: client_1.Role.ADMIN,
                                isApproved: true,
                                isVerified: true,
                                profile: {
                                    create: {
                                        firstName: 'Internably',
                                        lastName: 'Admin',
                                        headline: 'Community Operations',
                                        schoolId: schools[0].id,
                                        city: 'Atlanta',
                                        major: 'Operations'
                                    }
                                }
                            }
                        })];
                case 25:
                    admin = _g.sent();
                    return [4 /*yield*/, Promise.all(Array.from({ length: 16 }).map(function (_, idx) {
                            var school = schools[idx % schools.length];
                            var company = companies[idx % companies.length];
                            var firstName = "Student".concat(idx + 1);
                            var domains = ['gatech.edu', 'aamu.edu', 'howard.edu', 'uga.edu', 'spelman.edu'];
                            var domain = domains[idx % domains.length];
                            return prisma.user.create({
                                data: {
                                    email: "student".concat(idx + 1, "@").concat(domain),
                                    username: "student".concat(idx + 1),
                                    passwordHash: passwordHash,
                                    isApproved: true,
                                    isVerified: true,
                                    profile: {
                                        create: {
                                            firstName: firstName,
                                            lastName: 'Member',
                                            headline: idx % 2 === 0 ? 'Open to Summer 2026 Internships' : 'Building with peers at Internably',
                                            bio: 'Ambitious student focused on growth, mentorship, and internships.',
                                            schoolId: school.id,
                                            companyId: company.id,
                                            city: idx % 2 === 0 ? 'Atlanta' : 'Birmingham',
                                            major: idx % 2 === 0 ? 'Computer Science' : 'Business Administration',
                                            degree: 'Bachelors',
                                            graduationYear: 2027 + (idx % 3),
                                            openToNetwork: true,
                                            openToInternship: idx % 2 === 0
                                        }
                                    }
                                }
                            });
                        }))];
                case 26:
                    demoUsers = _g.sent();
                    return [4 /*yield*/, prisma.application.createMany({
                            data: [
                                {
                                    firstName: 'Ava',
                                    lastName: 'Johnson',
                                    email: 'ava.apply@gatech.edu',
                                    school: 'Georgia Tech',
                                    graduationYear: 2027,
                                    major: 'Computer Science',
                                    city: 'Atlanta',
                                    internshipCompany: 'Southern Company',
                                    status: client_1.ApplicationStatus.PENDING
                                },
                                {
                                    firstName: 'Jay',
                                    lastName: 'Brooks',
                                    email: 'jay.apply@howard.edu',
                                    school: 'Howard University',
                                    graduationYear: 2026,
                                    major: 'Finance',
                                    city: 'Washington',
                                    status: client_1.ApplicationStatus.APPROVED
                                }
                            ]
                        })];
                case 27:
                    _g.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.group.create({ data: { name: 'Atlanta Interns', slug: 'atlanta-interns', type: client_1.GroupType.CITY, description: 'Students and interns in Atlanta', ownerId: admin.id } }),
                            prisma.group.create({ data: { name: 'HBCU Interns', slug: 'hbcu-interns', type: client_1.GroupType.HBCU, description: 'A high-trust HBCU-focused intern network', ownerId: admin.id } }),
                            prisma.group.create({ data: { name: 'Georgia Tech Students', slug: 'georgia-tech-students', type: client_1.GroupType.SCHOOL, description: 'Georgia Tech Internably members', ownerId: admin.id } }),
                            prisma.group.create({ data: { name: 'Alabama A&M Students', slug: 'alabama-a-and-m-students', type: client_1.GroupType.SCHOOL, description: 'Alabama A&M student community', ownerId: admin.id } }),
                            prisma.group.create({ data: { name: 'Southern Company Interns', slug: 'southern-company-interns', type: client_1.GroupType.COMPANY, description: 'Current and aspiring Southern Company interns', ownerId: admin.id } }),
                            prisma.group.create({ data: { name: 'Tech Interns', slug: 'tech-interns', type: client_1.GroupType.INTEREST, description: 'Engineering internships and interview prep', ownerId: admin.id } }),
                            prisma.group.create({ data: { name: 'Finance Interns', slug: 'finance-interns', type: client_1.GroupType.INTEREST, description: 'Finance internship opportunities and tips', ownerId: admin.id } })
                        ])];
                case 28:
                    groups = _g.sent();
                    _i = 0, _a = __spreadArray([admin], demoUsers, true);
                    _g.label = 29;
                case 29:
                    if (!(_i < _a.length)) return [3 /*break*/, 34];
                    user = _a[_i];
                    _b = 0, _c = groups.slice(0, 4);
                    _g.label = 30;
                case 30:
                    if (!(_b < _c.length)) return [3 /*break*/, 33];
                    group = _c[_b];
                    if (!(Math.random() > 0.35 || user.id === admin.id)) return [3 /*break*/, 32];
                    return [4 /*yield*/, prisma.groupMember.upsert({
                            where: { groupId_userId: { groupId: group.id, userId: user.id } },
                            update: {},
                            create: { groupId: group.id, userId: user.id, isModerator: user.id === admin.id }
                        })];
                case 31:
                    _g.sent();
                    _g.label = 32;
                case 32:
                    _b++;
                    return [3 /*break*/, 30];
                case 33:
                    _i++;
                    return [3 /*break*/, 29];
                case 34:
                    i = 0;
                    _g.label = 35;
                case 35:
                    if (!(i < 26)) return [3 /*break*/, 38];
                    author = demoUsers[i % demoUsers.length];
                    group = groups[i % groups.length];
                    return [4 /*yield*/, prisma.post.create({
                            data: {
                                authorId: author.id,
                                groupId: i % 2 === 0 ? group.id : null,
                                content: i % 2 === 0
                                    ? "Looking to connect with ".concat(group.name, " members around internship prep and referrals.")
                                    : 'Built for interns. Powered by ambition. Who is attending career fair prep this week?'
                            }
                        })];
                case 36:
                    _g.sent();
                    _g.label = 37;
                case 37:
                    i++;
                    return [3 /*break*/, 35];
                case 38:
                    u1 = demoUsers[0], u2 = demoUsers[1], u3 = demoUsers[2];
                    return [4 /*yield*/, prisma.connectionRequest.create({ data: { fromUserId: u1.id, toUserId: u2.id } })];
                case 39:
                    _g.sent();
                    return [4 /*yield*/, prisma.connection.create({ data: { userAId: u1.id, userBId: u3.id } })];
                case 40:
                    _g.sent();
                    return [4 /*yield*/, prisma.conversation.create({ data: {} })];
                case 41:
                    convo = _g.sent();
                    return [4 /*yield*/, prisma.conversationMember.createMany({
                            data: [
                                { conversationId: convo.id, userId: u1.id },
                                { conversationId: convo.id, userId: u3.id }
                            ]
                        })];
                case 42:
                    _g.sent();
                    return [4 /*yield*/, prisma.message.createMany({
                            data: [
                                { conversationId: convo.id, senderId: u1.id, content: 'Hey! Are you open to sharing your resume format?' },
                                { conversationId: convo.id, senderId: u3.id, content: 'Absolutely. I can send the version that worked for me this season.' }
                            ]
                        })];
                case 43:
                    _g.sent();
                    return [4 /*yield*/, prisma.notification.createMany({
                            data: [
                                { userId: u2.id, type: client_1.NotificationType.CONNECTION_REQUEST, title: 'New connection request', body: 'Student1 wants to connect.' },
                                { userId: u1.id, type: client_1.NotificationType.MESSAGE, title: 'New message', body: 'Student3 sent you a message.' }
                            ]
                        })];
                case 44:
                    _g.sent();
                    _d = 0, demoUsers_1 = demoUsers;
                    _g.label = 45;
                case 45:
                    if (!(_d < demoUsers_1.length)) return [3 /*break*/, 51];
                    user = demoUsers_1[_d];
                    return [4 /*yield*/, prisma.profile.findUniqueOrThrow({ where: { userId: user.id } })];
                case 46:
                    profile = _g.sent();
                    _e = 0, _f = interests.slice(0, 3);
                    _g.label = 47;
                case 47:
                    if (!(_e < _f.length)) return [3 /*break*/, 50];
                    interest = _f[_e];
                    if (!(Math.random() > 0.4)) return [3 /*break*/, 49];
                    return [4 /*yield*/, prisma.userInterest.create({
                            data: {
                                userId: user.id,
                                profileId: profile.id,
                                interestId: interest.id
                            }
                        })];
                case 48:
                    _g.sent();
                    _g.label = 49;
                case 49:
                    _e++;
                    return [3 /*break*/, 47];
                case 50:
                    _d++;
                    return [3 /*break*/, 45];
                case 51:
                    console.log('Seed complete. Demo accounts:');
                    console.log('admin@internably.com / Password123!');
                    console.log('student1@gatech.edu / Password123!');
                    console.log('student2@aamu.edu / Password123!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
