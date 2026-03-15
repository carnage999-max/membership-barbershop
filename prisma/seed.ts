import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting system initialization...');

  // 1. Clear existing data
  await prisma.queueEntry.deleteMany();
  await prisma.review.deleteMany();
  await prisma.userMembership.deleteMany();
  await prisma.stylistFollow.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.location.deleteMany();
  await prisma.service.deleteMany();

  // 2. Create Services (Walk-In Pricing)
  console.log('Creating services (walk-in pricing)...');
  const servicesData = [
    { name: 'Standard Haircut', basePrice: 19.99, category: 'Haircut', duration: 30 },
    { name: 'Back Shave / Neck Cleanup', basePrice: 5.00, category: 'Add-on', duration: 10 },
    { name: 'Ear Wax', basePrice: 15.00, category: 'Add-on', duration: 15 },
    { name: 'Nose Wax', basePrice: 15.00, category: 'Add-on', duration: 15 },
    { name: '5 Minute Neck / Shoulder Massage', basePrice: 10.00, category: 'Add-on', duration: 5 },
    { name: '15 Minute Massage Upgrade', basePrice: 20.00, category: 'Add-on', duration: 15 },
    { name: 'Beard Trim / Line Up', basePrice: 10.00, category: 'Shave', duration: 20 },
    { name: 'Beard Sculpt / Razor Line', basePrice: 15.00, category: 'Shave', duration: 30 },
    { name: 'Hot Towel Treatment', basePrice: 5.00, category: 'Add-on', duration: 10 },
    { name: 'Kids Cut (under 12)', basePrice: 17.99, category: 'Haircut', duration: 25 },
    { name: 'Senior Cut', basePrice: 17.99, category: 'Haircut', duration: 30 },
  ];

  for (const service of servicesData) {
    await prisma.service.create({ data: service });
  }

  // 3. Create a Location (Flagship Garage)
  console.log('Creating flagship location...');
  const location = await prisma.location.create({
    data: {
      name: 'The Heritage Lounge (Flagship)',
      slug: 'heritage-lounge-flagship',
      address: '444 Artisan Way',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      phone: '313-555-0100',
      latitude: 42.3314,
      longitude: -83.0458,
      openTime: '08:00',
      closeTime: '20:00',
      timezone: 'America/Detroit',
    },
  });

  // 4. Create Membership Plans
  console.log('Creating membership plans...');
  const plansData = [
    // Haircut-Only Tracks
    {
      name: 'Basic',
      slug: 'basic',
      price: 29.99,
      visitsPerMonth: 1,
      description: '1 Precision haircut per month',
      locationId: location.id,
    },
    {
      name: 'Standard',
      slug: 'standard',
      price: 39.99,
      visitsPerMonth: 2,
      description: '2 Precision haircuts per month',
      locationId: location.id,
    },
    {
      name: 'Premium',
      slug: 'premium',
      price: 49.99,
      visitsPerMonth: 4,
      description: '4 Precision haircuts per month',
      locationId: location.id,
    },
    {
      name: 'Unlimited',
      slug: 'unlimited',
      price: 65.99,
      visitsPerMonth: 31,
      isUnlimited: true,
      description: 'Unlimited haircuts (Fair use policy applies)',
      locationId: location.id,
    },
    // MVP Tracks
    {
      name: 'MVP Basic',
      slug: 'mvp-basic',
      price: 39.99,
      visitsPerMonth: 1,
      mvpAccess: true,
      includesBackShave: true,
      includesHotTowel: true,
      includesMassage: true,
      description: '1 MVP visit per month (Haircut + Shave + Towel + 5m Massage)',
      locationId: location.id,
    },
    {
      name: 'MVP Standard',
      slug: 'mvp-standard',
      price: 49.99,
      visitsPerMonth: 2,
      mvpAccess: true,
      includesBackShave: true,
      includesHotTowel: true,
      includesMassage: true,
      description: '2 MVP visits per month',
      locationId: location.id,
    },
    {
      name: 'MVP Premium',
      slug: 'mvp-premium',
      price: 59.99,
      visitsPerMonth: 4,
      mvpAccess: true,
      includesBackShave: true,
      includesHotTowel: true,
      includesMassage: true,
      description: '4 MVP visits per month',
      locationId: location.id,
    },
    {
      name: 'MVP Unlimited',
      slug: 'mvp-unlimited',
      price: 79.99,
      visitsPerMonth: 31,
      isUnlimited: true,
      mvpAccess: true,
      includesBackShave: true,
      includesHotTowel: true,
      includesMassage: true,
      description: 'Unlimited MVP visits (Fair use policy applies)',
      locationId: location.id,
    },
  ];

  for (const plan of plansData) {
    await prisma.membershipPlan.create({ data: plan });
  }

  // 5. Create Artisans (Stylists)
  console.log('Creating artisans...');
  await prisma.stylist.create({
    data: {
      locationId: location.id,
      firstName: 'Julian',
      lastName: 'Thorne',
      bio: 'Master of the precision taper and classic artisan styles.',
      specialties: ['Artisan Taper', 'Beard Sculpture'],
      avgCutTime: 25,
      rating: 4.9,
      onShift: true,
    },
  });

  await prisma.stylist.create({
    data: {
      locationId: location.id,
      firstName: 'Marcus',
      lastName: 'Reed',
      bio: 'Expert in modern texture and bespoke grooming rituals.',
      specialties: ['Textured Cuts', 'Signature Rituals'],
      avgCutTime: 30,
      rating: 5.0,
      onShift: true,
    },
  });

  // 6. Admin User
  const adminPasswordHash = await hashPassword('admin123');
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      firstName: 'Garage',
      lastName: 'Manager',
      role: 'ADMIN',
    },
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
