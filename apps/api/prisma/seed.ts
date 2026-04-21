import { PrismaClient, Role, ApplicationStatus, GroupType, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.connectionRequest.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.pushDevice.deleteMany();
  await prisma.group.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.application.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.school.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const schools = await Promise.all([
    prisma.school.create({ data: { name: 'Georgia Tech', city: 'Atlanta', state: 'GA', isHBCU: false } }),
    prisma.school.create({ data: { name: 'Alabama A&M University', city: 'Normal', state: 'AL', isHBCU: true } }),
    prisma.school.create({ data: { name: 'Howard University', city: 'Washington', state: 'DC', isHBCU: true } }),
    prisma.school.create({ data: { name: 'University of Georgia', city: 'Athens', state: 'GA', isHBCU: false } }),
    prisma.school.create({ data: { name: 'Spelman College', city: 'Atlanta', state: 'GA', isHBCU: true } })
  ]);

  const companies = await Promise.all([
    prisma.company.create({ data: { name: 'Southern Company', city: 'Atlanta' } }),
    prisma.company.create({ data: { name: 'Microsoft', city: 'Redmond' } }),
    prisma.company.create({ data: { name: 'Google', city: 'Mountain View' } }),
    prisma.company.create({ data: { name: 'PwC', city: 'New York' } }),
    prisma.company.create({ data: { name: 'Delta Air Lines', city: 'Atlanta' } })
  ]);

  const interests = await Promise.all(
    ['Software Engineering', 'Product', 'Finance', 'AI/ML', 'Campus Leadership', 'Design', 'Consulting']
      .map((name) => prisma.interest.create({ data: { name } }))
  );

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@internably.com',
      username: 'internably_admin',
      passwordHash,
      role: Role.ADMIN,
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
  });

  const demoUsers = await Promise.all(
    Array.from({ length: 16 }).map((_, idx) => {
      const school = schools[idx % schools.length];
      const company = companies[idx % companies.length];
      const firstName = `Student${idx + 1}`;
      const domains = ['gatech.edu', 'aamu.edu', 'howard.edu', 'uga.edu', 'spelman.edu'];
      const domain = domains[idx % domains.length];
      return prisma.user.create({
        data: {
          email: `student${idx + 1}@${domain}`,
          username: `student${idx + 1}`,
          passwordHash,
          isApproved: true,
          isVerified: true,
          profile: {
            create: {
              firstName,
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
    })
  );

  await prisma.application.createMany({
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
        status: ApplicationStatus.PENDING
      },
      {
        firstName: 'Jay',
        lastName: 'Brooks',
        email: 'jay.apply@howard.edu',
        school: 'Howard University',
        graduationYear: 2026,
        major: 'Finance',
        city: 'Washington',
        status: ApplicationStatus.APPROVED
      }
    ]
  });

  const groups = await Promise.all([
    prisma.group.create({ data: { name: 'Atlanta Interns', slug: 'atlanta-interns', type: GroupType.CITY, description: 'Students and interns in Atlanta', ownerId: admin.id } }),
    prisma.group.create({ data: { name: 'HBCU Interns', slug: 'hbcu-interns', type: GroupType.HBCU, description: 'A high-trust HBCU-focused intern network', ownerId: admin.id } }),
    prisma.group.create({ data: { name: 'Georgia Tech Students', slug: 'georgia-tech-students', type: GroupType.SCHOOL, description: 'Georgia Tech Internably members', ownerId: admin.id } }),
    prisma.group.create({ data: { name: 'Alabama A&M Students', slug: 'alabama-a-and-m-students', type: GroupType.SCHOOL, description: 'Alabama A&M student community', ownerId: admin.id } }),
    prisma.group.create({ data: { name: 'Southern Company Interns', slug: 'southern-company-interns', type: GroupType.COMPANY, description: 'Current and aspiring Southern Company interns', ownerId: admin.id } }),
    prisma.group.create({ data: { name: 'Tech Interns', slug: 'tech-interns', type: GroupType.INTEREST, description: 'Engineering internships and interview prep', ownerId: admin.id } }),
    prisma.group.create({ data: { name: 'Finance Interns', slug: 'finance-interns', type: GroupType.INTEREST, description: 'Finance internship opportunities and tips', ownerId: admin.id } })
  ]);

  for (const user of [admin, ...demoUsers]) {
    for (const group of groups.slice(0, 4)) {
      if (Math.random() > 0.35 || user.id === admin.id) {
        await prisma.groupMember.upsert({
          where: { groupId_userId: { groupId: group.id, userId: user.id } },
          update: {},
          create: { groupId: group.id, userId: user.id, isModerator: user.id === admin.id }
        });
      }
    }
  }

  for (let i = 0; i < 26; i++) {
    const author = demoUsers[i % demoUsers.length];
    const group = groups[i % groups.length];
    await prisma.post.create({
      data: {
        authorId: author.id,
        groupId: i % 2 === 0 ? group.id : null,
        content: i % 2 === 0
          ? `Looking to connect with ${group.name} members around internship prep and referrals.`
          : 'Built for interns. Powered by ambition. Who is attending career fair prep this week?'
      }
    });
  }

  const [u1, u2, u3] = demoUsers;
  await prisma.connectionRequest.create({ data: { fromUserId: u1.id, toUserId: u2.id } });
  await prisma.connection.create({ data: { userAId: u1.id, userBId: u3.id } });

  const convo = await prisma.conversation.create({ data: {} });
  await prisma.conversationMember.createMany({
    data: [
      { conversationId: convo.id, userId: u1.id },
      { conversationId: convo.id, userId: u3.id }
    ]
  });
  await prisma.message.createMany({
    data: [
      { conversationId: convo.id, senderId: u1.id, content: 'Hey! Are you open to sharing your resume format?' },
      { conversationId: convo.id, senderId: u3.id, content: 'Absolutely. I can send the version that worked for me this season.' }
    ]
  });

  await prisma.notification.createMany({
    data: [
      { userId: u2.id, type: NotificationType.CONNECTION_REQUEST, title: 'New connection request', body: 'Student1 wants to connect.' },
      { userId: u1.id, type: NotificationType.MESSAGE, title: 'New message', body: 'Student3 sent you a message.' }
    ]
  });

  for (const user of demoUsers) {
    const profile = await prisma.profile.findUniqueOrThrow({ where: { userId: user.id } });
    for (const interest of interests.slice(0, 3)) {
      if (Math.random() > 0.4) {
        await prisma.userInterest.create({
          data: {
            userId: user.id,
            profileId: profile.id,
            interestId: interest.id
          }
        });
      }
    }
  }

  console.log('Seed complete. Demo accounts:');
  console.log('admin@internably.com / Password123!');
  console.log('student1@gatech.edu / Password123!');
  console.log('student2@aamu.edu / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
