# API Endpoints Reference

Complete list of all backend API endpoints for the Membership Barbershop application.

## Authentication Service

### POST /api/auth/register
**Status**: ✅ Created
Create a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890" // optional
}
```

**Response**:
```json
{
  "user": { "id": "...", "email": "...", "firstName": "...", "lastName": "..." },
  "token": "jwt-token",
  "message": "Account created successfully"
}
```

### POST /api/auth/login
**Status**: ✅ Created
Login to existing account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "user": { "id": "...", "email": "...", "firstName": "...", "memberships": [...] },
  "token": "jwt-token",
  "message": "Login successful"
}
```

---

## Membership Service

### GET /api/memberships/plans
**Status**: ✅ Created
Get all available membership plans, optionally filtered by location.

**Query Parameters**:
- `locationId` (optional): Filter plans by location

**Response**:
```json
{
  "plans": [
    {
      "id": "...",
      "name": "MVP",
      "description": "Full luxury experience",
      "price": 49.00,
      "cutsPerMonth": 4,
      "mvpAccess": true,
      "priority": true,
      "location": { "id": "...", "name": "Downtown Garage" }
    }
  ]
}
```

### POST /api/memberships/subscribe
**Status**: 🔨 To be created
Subscribe to a membership plan.

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "planId": "plan-uuid",
  "paymentMethodId": "pm_stripe_id"
}
```

### GET /api/memberships/my-membership
**Status**: 🔨 To be created
Get current user's active membership.

**Headers**: `Authorization: Bearer {token}`

### PATCH /api/memberships/[id]/cancel
**Status**: 🔨 To be created
Cancel a membership.

**Headers**: `Authorization: Bearer {token}`

---

## Location Service

### GET /api/locations
**Status**: 🔨 To be created
Get all active locations.

**Query Parameters**:
- `lat` (optional): Latitude for distance calculation
- `lng` (optional): Longitude for distance calculation

**Response**:
```json
{
  "locations": [
    {
      "id": "...",
      "name": "Downtown Garage",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "phone": "+1234567890",
      "openTime": "09:00",
      "closeTime": "20:00",
      "currentWaitTime": 12,
      "distance": 2.3 // if lat/lng provided
    }
  ]
}
```

### GET /api/locations/[id]
**Status**: 🔨 To be created
Get specific location details including stylists and wait time.

### GET /api/locations/[id]/wait-time
**Status**: 🔨 To be created
Get current wait time and queue status for a location.

**Response**:
```json
{
  "locationId": "...",
  "currentWaitTime": 12,
  "confidenceBand": [10, 15],
  "queueLength": 5,
  "status": "available", // available | limited | high | closed
  "stylistsOnShift": 3
}
```

---

## Queue Service

### POST /api/queue/join
**Status**: 🔨 To be created
Join the queue at a specific location.

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "locationId": "location-uuid",
  "stylistId": "stylist-uuid" // optional
}
```

**Response**:
```json
{
  "queueEntry": {
    "id": "...",
    "position": 3,
    "estimatedWait": 12,
    "confidenceBand": [10, 15],
    "status": "WAITING"
  }
}
```

### GET /api/queue/my-position
**Status**: 🔨 To be created
Get user's current queue position.

**Headers**: `Authorization: Bearer {token}`

### DELETE /api/queue/leave
**Status**: 🔨 To be created
Leave the queue.

**Headers**: `Authorization: Bearer {token}`

---

## Stylist Service

### GET /api/stylists
**Status**: 🔨 To be created
Get stylists, optionally filtered by location.

**Query Parameters**:
- `locationId` (optional): Filter by location
- `onShift` (optional): Filter by shift status

**Response**:
```json
{
  "stylists": [
    {
      "id": "...",
      "firstName": "Mike",
      "lastName": "Rodriguez",
      "photoUrl": "https://...",
      "specialties": ["Fade", "Beard", "Kids"],
      "avgCutTime": 18,
      "rating": 4.9,
      "totalReviews": 156,
      "onShift": true,
      "onBreak": false,
      "isFollowing": false
    }
  ]
}
```

### POST /api/stylists/[id]/follow
**Status**: 🔨 To be created
Follow a stylist to get notifications.

**Headers**: `Authorization: Bearer {token}`

### DELETE /api/stylists/[id]/unfollow
**Status**: 🔨 To be created
Unfollow a stylist.

**Headers**: `Authorization: Bearer {token}`

### GET /api/stylists/following
**Status**: 🔨 To be created
Get list of stylists the user is following.

**Headers**: `Authorization: Bearer {token}`

---

## Check-In Service

### POST /api/checkins
**Status**: 🔨 To be created
Check in to a location for a service.

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "locationId": "location-uuid",
  "stylistId": "stylist-uuid", // optional
  "services": ["Haircut", "Beard Trim"]
}
```

### GET /api/checkins/history
**Status**: 🔨 To be created
Get user's check-in history.

**Headers**: `Authorization: Bearer {token}`

### GET /api/checkins/[id]
**Status**: 🔨 To be created
Get specific check-in details.

**Headers**: `Authorization: Bearer {token}`

---

## Payment Service

### POST /api/payments/create-intent
**Status**: 🔨 To be created
Create a Stripe Payment Intent for membership subscription.

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "planId": "plan-uuid",
  "amount": 49.00
}
```

**Response**:
```json
{
  "clientSecret": "pi_..._secret_...",
  "paymentIntentId": "pi_..."
}
```

### POST /api/payments/webhook
**Status**: 🔨 To be created
Handle Stripe webhook events (payment success/failure).

**Note**: This endpoint must be publicly accessible and verify Stripe signatures.

### GET /api/payments/history
**Status**: 🔨 To be created
Get user's payment history.

**Headers**: `Authorization: Bearer {token}`

---

## Review Service

### POST /api/reviews
**Status**: 🔨 To be created
Submit a review for a stylist.

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "stylistId": "stylist-uuid",
  "rating": 5,
  "comment": "Great service!" // optional
}
```

### GET /api/reviews/stylist/[id]
**Status**: 🔨 To be created
Get reviews for a specific stylist.

---

## Notification Service

### POST /api/notifications/send
**Status**: 🔨 To be created (Internal use)
Send notification to a user. Used internally by other services.

### GET /api/notifications/preferences
**Status**: 🔨 To be created
Get user's notification preferences.

**Headers**: `Authorization: Bearer {token}`

### PATCH /api/notifications/preferences
**Status**: 🔨 To be created
Update notification preferences.

**Headers**: `Authorization: Bearer {token}`

---

## Admin Service (Optional)

### GET /api/admin/locations
**Status**: 🔨 To be created
Manage locations (admin only).

### GET /api/admin/queue/[locationId]
**Status**: 🔨 To be created
View and manage queue (admin only).

### PATCH /api/admin/stylists/[id]/status
**Status**: 🔨 To be created
Update stylist shift status (admin only).

---

## Implementation Priority

### Phase 1 (Essential - Week 1)
1. ✅ Auth: Register & Login
2. ✅ Membership: Get Plans
3. 🔨 Location: List & Details
4. 🔨 Queue: Join & Status
5. 🔨 Payment: Create Intent & Webhook

### Phase 2 (Core Features - Week 2)
6. 🔨 Membership: Subscribe & My Membership
7. 🔨 Stylist: List & Follow
8. 🔨 Check-In: Create & History
9. 🔨 Notifications: Send Email

### Phase 3 (Enhanced Features - Week 3)
10. 🔨 Reviews: Submit & List
11. 🔨 Queue: Real-time Updates
12. 🔨 Payment: History
13. 🔨 Notification: Preferences

### Phase 4 (Admin & Polish - Week 4)
14. 🔨 Admin: Dashboard
15. 🔨 Admin: Queue Management
16. 🔨 Analytics & Reporting
17. 🔨 Rate Limiting & Security

---

## Status Legend
- ✅ Created and tested
- 🔨 To be created
- 🚧 In progress
- ⚠️ Needs review
- ❌ Deprecated
