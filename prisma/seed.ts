import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Locations
  console.log('📍 Creating locations...');
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Downtown Garage',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '+12125551234',
        latitude: 40.7128,
        longitude: -74.0060,
        openTime: '09:00',
        closeTime: '20:00',
        timezone: 'America/New_York',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Highway 101',
        address: '456 Highway 101',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        phone: '+13105551234',
        latitude: 34.0522,
        longitude: -118.2437,
        openTime: '08:00',
        closeTime: '21:00',
        timezone: 'America/Los_Angeles',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Riverside Blvd',
        address: '789 Riverside Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        phone: '+13125551234',
        latitude: 41.8781,
        longitude: -87.6298,
        openTime: '09:00',
        closeTime: '19:00',
        timezone: 'America/Chicago',
      },
    }),
  ]);

  // Create Membership Plans
  console.log('💳 Creating membership plans...');
  const plans = [];
  for (const location of locations) {
    const locationPlans = await Promise.all([
      prisma.membershipPlan.create({
        data: {
          locationId: location.id,
          name: 'Basic',
          description: 'Perfect for occasional visits',
          price: 29.00,
          cutsPerMonth: 2,
          mvpAccess: false,
          priority: false,
        },
      }),
      prisma.membershipPlan.create({
        data: {
          locationId: location.id,
          name: 'MVP',
          description: 'Full luxury experience with priority access',
          price: 49.00,
          cutsPerMonth: 4,
          mvpAccess: true,
          priority: true,
        },
      }),
      prisma.membershipPlan.create({
        data: {
          locationId: location.id,
          name: 'Pro',
          description: 'Unlimited cuts and premium services',
          price: 79.00,
          cutsPerMonth: 12,
          mvpAccess: true,
          priority: true,
        },
      }),
    ]);
    plans.push(...locationPlans);
  }

  // Create Stylists
  console.log('✂️ Creating stylists...');
  const stylists = await Promise.all([
    // Downtown Garage
    prisma.stylist.create({
      data: {
        locationId: locations[0].id,
        firstName: 'Mike',
        lastName: 'Rodriguez',
        bio: 'Specializing in modern fades and classic cuts',
        specialties: ['Fade', 'Beard', 'Classic'],
        avgCutTime: 18,
        rating: 4.9,
        totalReviews: 156,
        onShift: true,
        onBreak: false,
      },
    }),
    prisma.stylist.create({
      data: {
        locationId: locations[0].id,
        firstName: 'Alex',
        lastName: 'Chen',
        bio: 'Expert in precision cuts and styling',
        specialties: ['Fade', 'Design', 'Color'],
        avgCutTime: 20,
        rating: 4.8,
        totalReviews: 142,
        onShift: true,
        onBreak: false,
      },
    }),
    prisma.stylist.create({
      data: {
        locationId: locations[0].id,
        firstName: 'Chris',
        lastName: 'Taylor',
        bio: 'Master barber with 15 years experience',
        specialties: ['Classic', 'Beard', 'Kids'],
        avgCutTime: 22,
        rating: 4.7,
        totalReviews: 98,
        onShift: false,
        onBreak: false,
        nextShiftAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
    }),
    // Highway 101
    prisma.stylist.create({
      data: {
        locationId: locations[1].id,
        firstName: 'Jordan',
        lastName: 'Williams',
        bio: 'Creative stylist with modern techniques',
        specialties: ['Fade', 'Design', 'Texture'],
        avgCutTime: 19,
        rating: 4.9,
        totalReviews: 203,
        onShift: true,
        onBreak: false,
      },
    }),
    prisma.stylist.create({
      data: {
        locationId: locations[1].id,
        firstName: 'Sam',
        lastName: 'Johnson',
        bio: 'Precision cuts and beard sculpting',
        specialties: ['Beard', 'Classic', 'Fade'],
        avgCutTime: 21,
        rating: 4.8,
        totalReviews: 167,
        onShift: true,
        onBreak: true,
      },
    }),
    // Riverside Blvd
    prisma.stylist.create({
      data: {
        locationId: locations[2].id,
        firstName: 'Taylor',
        lastName: 'Martinez',
        bio: 'Award-winning barber specializing in fades',
        specialties: ['Fade', 'Design', 'Classic'],
        avgCutTime: 17,
        rating: 5.0,
        totalReviews: 287,
        onShift: true,
        onBreak: false,
      },
    }),
  ]);

  // Create Demo User
  console.log('👤 Creating demo user...');
  const passwordHash = await hashPassword('password123');
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'User',
      phone: '+15555551234',
    },
  });

  // Create Active Membership for Demo User
  console.log('🎫 Creating demo membership...');
  await prisma.userMembership.create({
    data: {
      userId: demoUser.id,
      planId: plans[1].id, // MVP plan at first location
      status: 'ACTIVE',
      startDate: new Date(),
      cutsRemaining: 4,
      billingCycle: 'monthly',
      autoRenew: true,
    },
  });

  // Create Queue Entries (simulate active queue)
  console.log('🚦 Creating queue entries...');
  await Promise.all([
    prisma.queueEntry.create({
      data: {
        locationId: locations[0].id,
        guestName: 'John Smith',
        guestPhone: '+15555552345',
        position: 1,
        estimatedWait: 12,
        confidenceBandMin: 10,
        confidenceBandMax: 15,
        status: 'WAITING',
      },
    }),
    prisma.queueEntry.create({
      data: {
        locationId: locations[0].id,
        guestName: 'Jane Doe',
        guestPhone: '+15555553456',
        position: 2,
        estimatedWait: 25,
        confidenceBandMin: 22,
        confidenceBandMax: 30,
        status: 'WAITING',
      },
    }),
  ]);

  // Follow a stylist
  console.log('⭐ Creating stylist follow...');
  await prisma.stylistFollow.create({
    data: {
      userId: demoUser.id,
      stylistId: stylists[0].id,
    },
  });

  // Create some reviews
  console.log('📝 Creating reviews...');
  await Promise.all([
    prisma.review.create({
      data: {
        userId: demoUser.id,
        stylistId: stylists[0].id,
        rating: 5,
        comment: 'Amazing cut! Mike really knows what he\'s doing.',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - ${locations.length} locations created`);
  console.log(`  - ${plans.length} membership plans created`);
  console.log(`  - ${stylists.length} stylists created`);
  console.log(`  - 1 demo user created (email: demo@example.com, password: password123)`);
  console.log('\n🚀 You can now start the app and test the API!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
