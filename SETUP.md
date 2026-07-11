# Quick Setup Guide

## Prerequisites

- Node.js 18+ and pnpm
- Clerk account (https://clerk.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

## Step 1: Clone and Install

```bash
pnpm install
```

## Step 2: Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Choose email/password as authentication method
4. Go to "API Keys" and copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

## Step 3: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add a database user (username: `admin`, generate a strong password)
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Click "Connect" → "Drivers" → "Node.js"
6. Copy the connection string, replace `<username>` and `<password>`

## Step 4: Environment Variables

Create `.env.local`:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# MongoDB
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=monsoon-preparedness

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Test Setup

1. **Landing Page** - See hero section with sign-up button
2. **Sign Up** - Create test account
3. **Redirect** - Should go to `/onboarding`
4. **API Health Check** - Visit `/api/health` to verify MongoDB

## Quick Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start

# Lint
pnpm lint
```

## Database Collections

After first user signup, MongoDB will auto-create:
- `users` - User accounts
- `profiles` - User profiles (to be created in Phase 1)
- `preparednessPlans` - Plans (Phase 1)
- `checklists` - Checklists (Phase 1)
- `travelPlans` - Travel plans (Phase 2)
- `alerts` - Alerts (Phase 2)

## Troubleshooting

### "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set"
- Add the variable to `.env.local`
- Restart dev server

### "Failed to connect to MongoDB"
- Check connection string in `.env.local`
- Verify IP whitelist in MongoDB Atlas
- Test: `curl http://localhost:3000/api/health`

### "Sign up not working"
- Check Clerk credentials in environment
- Verify sign-up URL in Clerk dashboard

## Next: Phase 1

After foundation is verified, Phase 1 will add:
- Onboarding wizard
- Dashboard with preparedness score
- AI-based recommendations
- Interactive checklist
- Risk assessment engine

See `PHASE_0_FOUNDATION.md` for complete documentation.
