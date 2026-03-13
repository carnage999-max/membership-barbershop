# Frontend-Backend Integration Guide

This guide shows how to integrate the backend API into your existing frontend pages.

## Quick Start

### 1. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy example and fill in your values
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secure string
- `RESEND_API_KEY` - Get from https://resend.com
- `NEXT_PUBLIC_APP_URL` - Your app URL (http://localhost:3000 for dev)

### 2. Install Dependencies

```bash
# Dependencies should already be installed
# If not, run:
npm install
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

## API Client Usage

The API client is located at `lib/api-client.ts` and provides easy-to-use functions for all API calls.

### Authentication Example

```typescript
import { auth, tokenStorage, session } from '@/lib/api-client';

// Register
async function handleRegister() {
  try {
    const result = await auth.register({
      email: 'user@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    });

    // Save token and user
    tokenStorage.set(result.token);
    session.setCurrentUser(result.user);

    // Redirect to dashboard
    router.push('/account');
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// Login
async function handleLogin() {
  try {
    const result = await auth.login('user@example.com', 'password123');

    tokenStorage.set(result.token);
    session.setCurrentUser(result.user);

    router.push('/account');
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### Locations Example

```typescript
import { locations } from '@/lib/api-client';

// Get all locations with user's coordinates
async function loadLocations() {
  try {
    // Get user's location
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const result = await locations.getAll(latitude, longitude);

      // result.locations will be sorted by distance
      setLocations(result.locations);
    });
  } catch (error) {
    console.error('Failed to load locations:', error);
  }
}

// Get specific location details
async function loadLocationDetails(locationId: string) {
  try {
    const result = await locations.getById(locationId);
    setLocation(result.location);
  } catch (error) {
    console.error('Failed to load location:', error);
  }
}
```

### Membership Example

```typescript
import { memberships, tokenStorage } from '@/lib/api-client';

// Get membership plans for a location
async function loadPlans(locationId: string) {
  try {
    const result = await memberships.getPlans(locationId);
    setPlans(result.plans);
  } catch (error) {
    console.error('Failed to load plans:', error);
  }
}

// Subscribe to a plan
async function handleSubscribe(planId: string, paymentMethodId: string) {
  try {
    const token = tokenStorage.get();
    if (!token) {
      router.push('/login');
      return;
    }

    const result = await memberships.subscribe(planId, paymentMethodId, token);

    // Show success message
    alert('Membership activated!');
    router.push('/account');
  } catch (error) {
    console.error('Subscription failed:', error);
  }
}

// Get current user's membership
async function loadMyMembership() {
  try {
    const token = tokenStorage.get();
    if (!token) return;

    const result = await memberships.getMyMembership(token);
    setMembership(result.membership);
  } catch (error) {
    console.error('Failed to load membership:', error);
  }
}
```

### Queue Example

```typescript
import { queue, tokenStorage } from '@/lib/api-client';

// Join queue
async function handleJoinQueue(locationId: string, stylistId?: string) {
  try {
    const token = tokenStorage.get();
    if (!token) {
      router.push('/login');
      return;
    }

    const result = await queue.join(locationId, token, stylistId);

    setQueuePosition(result.queueEntry);
    alert(`You're #${result.queueEntry.position} in line!`);
  } catch (error) {
    console.error('Failed to join queue:', error);
  }
}

// Get current position
async function checkMyPosition() {
  try {
    const token = tokenStorage.get();
    if (!token) return;

    const result = await queue.getMyPosition(token);

    if (result.queueEntry) {
      setQueuePosition(result.queueEntry);
    }
  } catch (error) {
    console.error('Failed to check position:', error);
  }
}

// Leave queue
async function handleLeaveQueue() {
  try {
    const token = tokenStorage.get();
    if (!token) return;

    await queue.leave(token);
    setQueuePosition(null);
    alert('Left the queue');
  } catch (error) {
    console.error('Failed to leave queue:', error);
  }
}
```

### Stylists Example

```typescript
import { stylists, tokenStorage } from '@/lib/api-client';

// Get stylists at a location
async function loadStylists(locationId: string) {
  try {
    const token = tokenStorage.get(); // Optional

    const result = await stylists.getAll(locationId, undefined, token);
    setStylists(result.stylists);
  } catch (error) {
    console.error('Failed to load stylists:', error);
  }
}

// Follow a stylist
async function handleFollowStylist(stylistId: string) {
  try {
    const token = tokenStorage.get();
    if (!token) {
      router.push('/login');
      return;
    }

    await stylists.follow(stylistId, token);

    // Update UI
    setStylistFollowing(true);
  } catch (error) {
    console.error('Failed to follow stylist:', error);
  }
}
```

## Updating Frontend Pages

### Example: Update Locations Page

**Before (Hardcoded)**:
```typescript
// app/locations/page.tsx
const mockLocations = [
  { id: '1', name: 'Downtown Garage', waitTime: 12 },
  // ... hardcoded data
];
```

**After (API Integration)**:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { locations } from '@/lib/api-client';

export default function LocationsPage() {
  const [locationsList, setLocationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const result = await locations.getAll(
                position.coords.latitude,
                position.coords.longitude
              );
              setLocationsList(result.locations);
              setLoading(false);
            },
            async () => {
              // Fallback: get without coordinates
              const result = await locations.getAll();
              setLocationsList(result.locations);
              setLoading(false);
            }
          );
        } else {
          const result = await locations.getAll();
          setLocationsList(result.locations);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load locations:', error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div>Loading locations...</div>;
  }

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      {/* Render locations */}
      {locationsList.map((location) => (
        <LocationCard key={location.id} {...location} />
      ))}
    </main>
  );
}
```

### Example: Update Stylists Page

```typescript
'use client';

import { useEffect, useState } from 'react';
import { stylists, tokenStorage } from '@/lib/api-client';
import StylistCard from '@/components/StylistCard';

export default function StylistsPage() {
  const [stylistsList, setStylistsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStylists() {
      try {
        const token = tokenStorage.get();
        const result = await stylists.getAll(undefined, true, token);
        setStylistsList(result.stylists);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load stylists:', error);
        setLoading(false);
      }
    }

    loadStylists();
  }, []);

  const handleFollow = async (stylistId: string) => {
    try {
      const token = tokenStorage.get();
      if (!token) {
        alert('Please login to follow stylists');
        return;
      }

      await stylists.follow(stylistId, token);

      // Reload stylists to update follow status
      const result = await stylists.getAll(undefined, true, token);
      setStylistsList(result.stylists);
    } catch (error) {
      console.error('Failed to follow stylist:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main className="min-h-screen pt-[60px] md:pt-0 bg-obsidian pb-32">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-bone mb-8">Our Stylists</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stylistsList.map((stylist) => (
            <StylistCard
              key={stylist.id}
              {...stylist}
              name={`${stylist.firstName} ${stylist.lastName}`}
              onFollow={() => handleFollow(stylist.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
```

## Protected Routes

Create a hook to protect authenticated routes:

```typescript
// lib/hooks/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/api-client';

export function useAuth(redirectTo = '/login') {
  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);

  return {
    token: tokenStorage.get(),
    isAuthenticated: !!tokenStorage.get(),
  };
}
```

Usage:
```typescript
'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export default function AccountPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div>Account page content</div>
  );
}
```

## Testing with Demo Account

After running the seed, you can test with:
- **Email**: `demo@example.com`
- **Password**: `password123`

This account has:
- An active MVP membership
- Following one stylist
- One review submitted

## Next Steps

1. **Replace hardcoded data** in all pages with API calls
2. **Add loading states** for better UX
3. **Add error handling** and user feedback
4. **Implement authentication UI** (login/register forms)
5. **Add real-time updates** for queue positions
6. **Integrate Stripe** for actual payments

## Common Patterns

### Loading State
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function load() {
    try {
      setLoading(true);
      const result = await api.call();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);
```

### Error Handling
```typescript
try {
  await api.call();
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    router.push('/login');
  } else {
    alert(error.message);
  }
}
```

## Troubleshooting

**Token expires**: Tokens last 7 days. Implement refresh or re-login.

**CORS errors**: Ensure `NEXT_PUBLIC_APP_URL` matches your dev server.

**Database errors**: Run `npm run db:push` to sync schema.

**Missing data**: Run `npm run db:seed` to populate test data.
