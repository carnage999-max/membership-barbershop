# 🚀 Quick Start Guide

Get your backend up and running in 5 minutes!

## Step 1: Get Your API Keys

### Required Services:

1. **PostgreSQL Database** (Choose one - all have free tiers):
   - [Neon](https://neon.tech) - Recommended, easiest setup
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)

   → Get your `DATABASE_URL` connection string

2. **Resend** (Email Service):
   - Sign up at [resend.com](https://resend.com)
   - Add domain: `nathanreardon.com` (or use test mode)
   - Get your `RESEND_API_KEY`

3. **Stripe** (Payments - Optional for now):
   - Sign up at [stripe.com](https://stripe.com)
   - Get test keys from Dashboard → Developers → API Keys

## Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your keys:
# - DATABASE_URL from step 1
# - RESEND_API_KEY from step 1
# - Generate JWT_SECRET (random 32+ char string)
```

## Step 3: Initialize Database

```bash
# Install dependencies (if not already done)
npm install

# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push

# Add test data
npm run db:seed
```

## Step 4: Start the Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Step 5: Test It!

### Demo Account
- Email: `demo@example.com`
- Password: `password123`

### Test API Endpoints

**Get Locations**:
```bash
curl http://localhost:3000/api/locations
```

**Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
```

**Get Membership Plans**:
```bash
curl http://localhost:3000/api/memberships/plans
```

## What You Get

✅ 3 locations (NYC, LA, Chicago)
✅ 9 membership plans
✅ 6 stylists
✅ Working authentication
✅ Queue management
✅ Email notifications
✅ Demo user with active membership

## Next Steps

1. **Read the docs**:
   - [BACKEND_COMPLETE.md](BACKEND_COMPLETE.md) - Overview
   - [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Connect frontend
   - [API_ENDPOINTS.md](API_ENDPOINTS.md) - API reference

2. **Update your frontend pages**:
   - Replace hardcoded data with API calls
   - Use the helpers in `lib/api-client.ts`

3. **Build features**:
   - Add login/register UI
   - Connect locations page to API
   - Implement membership subscription flow

## Need Help?

**Database issues?**
```bash
npm run db:push --force-reset  # ⚠️ Deletes all data
npm run db:seed  # Re-add test data
```

**Check your database**:
```bash
npm run db:studio  # Opens GUI at localhost:5555
```

**API not working?**
- Check `.env.local` has all required values
- Verify DATABASE_URL is correct
- Check console for errors

## Pro Tips

1. Use **Prisma Studio** to view/edit data visually
2. Check **Network tab** in browser DevTools to debug API calls
3. Use **Postman** or **Thunder Client** for API testing
4. Keep `npm run dev` running while developing

---

**You're all set!** 🎉

Your backend is running with:
- ✅ Authentication
- ✅ Real-time queue management
- ✅ Membership system
- ✅ Email notifications
- ✅ Location services

Start integrating with your frontend pages using the examples in [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)!
