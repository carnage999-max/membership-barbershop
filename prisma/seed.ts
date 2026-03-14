import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting system cleanup...');

  // Clear operational data
  await prisma.queueEntry.deleteMany();
  await prisma.review.deleteMany();
  await prisma.userMembership.deleteMany();
  await prisma.stylistFollow.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.location.deleteMany();

  // Ensure Admin User exists
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    console.log('Creating system administrator account...');
    const adminPasswordHash = await hashPassword('admin123');
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: adminPasswordHash,
        firstName: 'System',
        lastName: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log('System administrator created: admin@example.com / admin123');
  } else {
    console.log('System administrator account already exists.');
  }

  console.log('Database cleaned. No dummy locations or plans added.');
}

main()
  .catch((e) => {
    console.error('Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
