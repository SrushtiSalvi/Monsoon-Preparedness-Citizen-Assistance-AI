# Quick Start: Deploy to Production

## 1. Prepare Environment (5 minutes)

### Generate secrets:
```bash
# Generate BETTER_AUTH_SECRET
openssl rand -base64 32
# Copy the output and save it
```

### In Vercel Dashboard:
1. Go to your project settings
2. Click "Environment Variables"
3. Add these variables:
   - `DATABASE_URL` - From Neon connection string
   - `BETTER_AUTH_SECRET` - From above command
   - `BETTER_AUTH_URL` - https://your-production-domain.com
   - `SENTRY_DSN` - (Optional, for error tracking)

## 2. Deploy (2 minutes)

### Option A: Automatic Deployment
```bash
# Push to main branch
git push origin main
# Vercel automatically deploys
```

### Option B: Manual Deployment
```bash
# Via Vercel CLI
pnpm install -g vercel
vercel --prod
```

## 3. Post-Deployment Setup (10 minutes)

### Create database indexes:
```bash
psql $DATABASE_URL -f lib/db/migrations/indexes.sql
```

### Verify health:
```bash
# Test endpoint
curl https://your-domain.com/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-15T...","database":"connected","version":{"now":"2024-01-15T..."}}
```

## 4. Configure Monitoring

### Set up Sentry (Optional but Recommended):
1. Create account at https://sentry.io
2. Create new project
3. Add `SENTRY_DSN` to environment variables
4. Errors will automatically be tracked

### Enable Vercel Analytics:
1. Goes to Vercel dashboard
2. Click "Analytics"
3. Enable Web Analytics
4. View real-time metrics

## 5. First Hour Checks

- [ ] Health endpoint returns 200
- [ ] Can sign up and create account
- [ ] Can sign in with account
- [ ] Dashboard loads
- [ ] No errors in Sentry (if configured)
- [ ] Response times acceptable

## 6. Daily Monitoring

```bash
# Check error rate
# - Visit Sentry dashboard or Vercel logs

# Check database status
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"user\";"

# Monitor performance
# - Check Vercel Analytics dashboard
```

## Troubleshooting

### 502 Bad Gateway
- Check database connection: `psql $DATABASE_URL`
- Review Vercel logs
- Verify DATABASE_URL is correct

### Authentication Fails
- Verify BETTER_AUTH_SECRET is set
- Check session table exists: `psql $DATABASE_URL -c "SELECT * FROM session LIMIT 1;"`
- Review auth logs

### Slow Response Times
- Run database query analysis: `psql $DATABASE_URL -c "EXPLAIN ANALYZE SELECT * FROM profile;"`
- Check indexes created
- Review Vercel logs for errors

### 404 on Endpoints
- Verify route exists
- Check middleware configuration
- Review build output for errors

## Key Files

- **Deployment Guide**: `PRODUCTION_DEPLOYMENT.md`
- **Checklist**: `PRODUCTION_READY_CHECKLIST.md`
- **Summary**: `PRODUCTION_READY_SUMMARY.md`

## Support

- Vercel: https://vercel.com/help
- Neon: https://neon.tech/docs
- Next.js: https://nextjs.org/docs

---

**Your application is now live in production!**
