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

  // 2. Create Services (Standard Pricing)
  console.log('Creating services (standard pricing)...');
  const servicesData = [
    { name: 'Standard Haircut', basePrice: 19.99, category: 'Haircut', duration: 30 },
    { name: 'Beard Trim', basePrice: 5.00, category: 'Shave', duration: 15 },
    { name: 'Ear Wax', basePrice: 15.00, category: 'Add-on', duration: 15 },
    { name: '5 Minute Massage', basePrice: 10.00, category: 'Add-on', duration: 5 },
    { name: '15 Minute Massage', basePrice: 20.00, category: 'Add-on', duration: 15 },
    { name: 'Neck Shave', basePrice: 5.00, category: 'Add-on', duration: 10 },
    { name: 'Hot Towel', basePrice: 5.00, category: 'Add-on', duration: 10 },
  ];

  for (const service of servicesData) {
    await prisma.service.create({ data: service });
  }

  // 3. Create a Location (The Garage)
  console.log('Creating flagship garage...');
  const location = await prisma.location.create({
    data: {
      name: 'Man Cave Barber Shop (The Garage)',
      slug: 'man-cave-garage',
      address: '123 Performance Way',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      phone: '313-555-9111',
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
    {
      name: 'STOCK',
      slug: 'stock',
      price: 29.99,
      visitsPerMonth: 31,
      isUnlimited: true,
      description: 'Unlimited Haircuts, Member Scheduling, Priority Booking, Member Pricing on Add-ons',
      locationId: location.id,
      queuePriorityLevel: 2,
    },
    {
      name: 'MODIFIED',
      slug: 'modified',
      price: 39.99,
      visitsPerMonth: 31,
      isUnlimited: true,
      includesHotTowel: true,
      description: 'Everything in Stock, Neck Shave, Hot Towel, Express Member Lane',
      locationId: location.id,
      queuePriorityLevel: 3,
    },
    {
      name: 'TURBO',
      slug: 'turbo',
      price: 49.99,
      visitsPerMonth: 31,
      isUnlimited: true,
      includesHotTowel: true,
      description: 'Everything in Modified, Beard Trim Included, Hot Towel Every Visit, 10% Product Discount',
      locationId: location.id,
      queuePriorityLevel: 4,
    },
    {
      name: 'SUPERCHARGED',
      slug: 'supercharged',
      price: 65.99,
      visitsPerMonth: 31,
      isUnlimited: true,
      includesHotTowel: true,
      includesMassage: true,
      description: 'Everything in Turbo, 5 Minute Massage, VIP Scheduling, Free Birthday Haircut, 15% Product Discount',
      locationId: location.id,
      queuePriorityLevel: 5,
      mvpAccess: true,
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
