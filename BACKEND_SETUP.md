# Backend Setup Guide

This document provides complete instructions for setting up the backend API for the Membership Barbershop application.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Stripe account (for payments)
- Resend account (for emails)

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your actual values:

```env
# Database - Get from your PostgreSQL provider (Neon, Supabase, Railway, etc.)
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# JWT Secret - Generate a random string
JWT_SECRET="your-secure-random-string-at-least-32-characters"

# Stripe - Get from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend - Get from https://resend.com/api-keys
RESEND_API_KEY="re_..."
EMAIL_FROM="info@nathanreardon.com"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## Database Setup

1. Generate Prisma Client:
```bash
npx prisma generate
```

2. Push schema to database:
```bash
npx prisma db push
```

3. (Optional) Open Prisma Studio to view/edit data:
```bash
npx prisma studio
```

## API Endpoints Created

### Authentication Service
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login existing user

### Membership Service
- `GET /api/memberships/plans` - Get all membership plans
- `POST /api/memberships/subscribe` - Subscribe to a plan
- `GET /api/memberships/my-membership` - Get current user's membership
- `PATCH /api/memberships/cancel` - Cancel membership

### Location Service
- `GET /api/locations` - Get all locations
- `GET /api/locations/[id]` - Get specific location details
- `GET /api/locations/[id]/wait-time` - Get current wait time

### Queue Service
- `POST /api/queue/join` - Join queue at a location
- `GET /api/queue/position` - Get current queue position
- `DELETE /api/queue/leave` - Leave the queue

### Stylist Service
- `GET /api/stylists` - Get stylists by location
- `POST /api/stylists/[id]/follow` - Follow a stylist
- `DELETE /api/stylists/[id]/unfollow` - Unfollow a stylist

### Payment Service
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/webhook` - Handle Stripe webhooks

## API Usage Examples

### Register a New User
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890'
  })
});

const { user, token } = await response.json();
// Store token in localStorage or cookie
```

### Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123'
  })
});

const { user, token } = await response.json();
```

### Get Membership Plans
```javascript
const response = await fetch('/api/memberships/plans?locationId=abc123');
const { plans } = await response.json();
```

### Authenticated Request Example
```javascript
const response = await fetch('/api/memberships/my-membership', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const { membership } = await response.json();
```

## Seeding Initial Data

To populate your database with initial test data, create and run this seed script:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create locations
  const location = await prisma.location.create({
    data: {
      name: 'Downtown Garage',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1234567890',
      openTime: '09:00',
      closeTime: '20:00',
    },
  });

  // Create membership plans
  await prisma.membershipPlan.createMany({
    data: [
      {
        locationId: location.id,
        name: 'Basic',
        description: 'Perfect for occasional visits',
        price: 29.00,
        cutsPerMonth: 2,
        mvpAccess: false,
        priority: false,
      },
      {
        locationId: location.id,
        name: 'MVP',
        description: 'Full luxury experience',
        price: 49.00,
        cutsPerMonth: 4,
        mvpAccess: true,
        priority: true,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run the seed:
```bash
npx ts-node prisma/seed.ts
```

## Testing the API

Use tools like:
- **Postman** - Import the endpoints and test manually
- **Thunder Client** (VS Code extension)
- **curl** commands

Example curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## Next Steps

1. **Complete Additional API Endpoints** - Create routes for check-ins, reviews, etc.
2. **Add Stripe Integration** - Implement payment processing
3. **Set up Webhooks** - Configure Stripe and other webhooks
4. **Add Rate Limiting** - Protect APIs from abuse
5. **Implement Real-time Updates** - Use WebSockets or Server-Sent Events for queue updates
6. **Add Logging & Monitoring** - Use services like Sentry or LogRocket

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure your database server is running
- Check firewall/network settings

### Prisma Client Not Found
```bash
npx prisma generate
```

### Migration Issues
```bash
npx prisma db push --force-reset  # WARNING: Deletes all data
```

## Production Deployment

Before deploying to production:

1. Set strong `JWT_SECRET`
2. Use production Stripe keys
3. Set `NODE_ENV=production`
4. Enable database connection pooling
5. Set up proper CORS policies
6. Add rate limiting middleware
7. Enable HTTPS only
8. Set up database backups
9. Configure monitoring and alerts

## Support

For issues or questions:
- Check the Prisma docs: https://www.prisma.io/docs
- Check Next.js API routes docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Review the code comments in each API file
