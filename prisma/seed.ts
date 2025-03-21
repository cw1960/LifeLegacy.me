import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a test organization
  const organization = await prisma.organization.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Organization',
      subdomain: 'demo',
      subscriptionTier: 'professional',
      maxUsers: 25,
      branding: {
        primaryColor: '#4f46e5',
        logoUrl: '/logo.png',
        companyName: 'Demo Estate Planning',
      },
      active: true,
    },
  });

  console.log('Created organization:', organization);

  // Create a test organization user
  const orgUser = await prisma.organizationUser.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: 'admin-user-id', // This would be replaced with a real user ID
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: 'admin-user-id', // This would be replaced with a real user ID
      role: 'admin',
    },
  });

  console.log('Created organization user:', orgUser);

  // Create a test profile
  const profile = await prisma.profile.upsert({
    where: { userId: 'admin-user-id' },
    update: {},
    create: {
      userId: 'admin-user-id', // This would be replaced with a real user ID
      organizationId: organization.id,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@demo.lifelegacy.me',
      phone: '555-123-4567',
      avatarUrl: '/avatars/admin.png',
      bio: 'Administrator of the demo organization',
    },
  });

  console.log('Created profile:', profile);

  // Create some test clients
  for (let i = 1; i <= 5; i++) {
    const clientUserId = `client-${i}-user-id`; // This would be replaced with real user IDs
    
    const clientOrgUser = await prisma.organizationUser.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: clientUserId,
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        userId: clientUserId,
        role: 'client',
      },
    });

    const clientProfile = await prisma.profile.upsert({
      where: { userId: clientUserId },
      update: {},
      create: {
        userId: clientUserId,
        organizationId: organization.id,
        firstName: `Client`,
        lastName: `${i}`,
        email: `client${i}@example.com`,
        phone: `555-${100 + i}-${1000 + i}`,
      },
    });

    console.log(`Created client ${i}:`, clientProfile);

    // Add some test documents for each client
    const documentTypes = ['Will', 'Trust', 'Power of Attorney', 'Insurance Policy'];
    for (let j = 0; j < 2; j++) {
      const documentType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      await prisma.document.create({
        data: {
          organizationId: organization.id,
          userId: clientUserId,
          title: `${documentType} Document`,
          description: `${documentType} for Client ${i}`,
          fileUrl: `/documents/client${i}-${documentType.toLowerCase().replace(' ', '-')}.pdf`,
          fileType: 'application/pdf',
          fileSize: 1024 * 1024 * (1 + Math.random()),
          category: documentType.toLowerCase(),
        },
      });
    }

    // Add some test online accounts for each client
    const accountTypes = ['Social Media', 'Email', 'Banking', 'Subscription'];
    for (let j = 0; j < 2; j++) {
      const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
      await prisma.onlineAccount.create({
        data: {
          organizationId: organization.id,
          userId: clientUserId,
          accountName: `${accountType} Account`,
          website: `https://example.com/${accountType.toLowerCase().replace(' ', '')}`,
          username: `client${i}`,
          email: `client${i}@example.com`,
          category: accountType.toLowerCase(),
          notes: `Test ${accountType.toLowerCase()} account for demo purposes`,
        },
      });
    }

    // Add some test conversations for each client
    const conversations = [
      { role: 'user', content: 'How do I start planning my digital estate?' },
      { role: 'assistant', content: 'To start planning your digital estate, I recommend first making a list of all your online accounts, digital assets, and digital devices. This will give you a clear picture of what needs to be included in your plan.' },
      { role: 'user', content: 'What should I include in my will regarding digital assets?' },
      { role: 'assistant', content: 'In your will, you should specify who will have access to your digital assets, provide instructions for handling specific accounts or assets, and include information about where to find access information. It\'s also important to consult with an attorney to ensure your wishes comply with relevant laws.' },
    ];

    const sessionId = `session-${i}-${Date.now()}`;
    for (const convo of conversations) {
      await prisma.conversationHistory.create({
        data: {
          organizationId: organization.id,
          userId: clientUserId,
          sessionId,
          role: convo.role,
          content: convo.content,
        },
      });
    }
  }

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 