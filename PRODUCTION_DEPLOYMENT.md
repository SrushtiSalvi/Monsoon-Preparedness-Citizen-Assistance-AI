# Production Deployment Guide

## Pre-Deployment Checklist

### Security
- [x] Input validation with Zod schemas
- [x] Security headers in middleware (CSP, X-Frame-Options, etc.)
- [x] Environment variable validation at startup
- [x] Error handling with proper HTTP status codes
- [x] HTTPS enforced for all production URLs
- [ ] API rate limiting configured
- [ ] CORS properly configured for your domain

### Database
- [ ] Database backups configured in Neon
- [ ] Indexes created (run `indexes.sql`)
- [ ] Connection pooling optimized
- [ ] Query timeouts set appropriately
- [ ] Database monitoring enabled

### Monitoring & Logging
- [x] Structured logging configured
- [ ] Sentry error tracking configured
- [ ] Web Vitals monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Alert thresholds set

### Performance
- [ ] Code split and optimized
- [ ] Images optimized with Next.js Image
- [ ] Caching headers configured
- [ ] CDN configured for static assets
- [ ] Bundle analyzed (run `next/analyze`)

## Environment Setup

### 1. Neon Database
```bash
# Create production database in Neon
# Get connection string: DATABASE_URL
```

### 2. Environment Variables
Copy `.env.production.example` to `.env.production.local`:
```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=https://your-domain.com
SENTRY_DSN=https://...
```

### 3. Create Database Indexes
```bash
# Connect to Neon and run:
psql $DATABASE_URL -f lib/db/migrations/indexes.sql
```

## Deployment Steps

### Via Vercel (Recommended)

1. **Connect GitHub**
   ```bash
   # Push code to GitHub repository
   ```

2. **Import Project**
   - Go to vercel.com/new
   - Select your repository
   - Configure environment variables
   - Deploy

3. **Post-Deployment**
   ```bash
   # Verify health endpoint
   curl https://your-domain.com/api/health
   
   # Check error pages
   curl https://your-domain.com/nonexistent  # Should return 404
   ```

### Manual Deployment

```bash
# 1. Install dependencies
pnpm install

# 2. Build
pnpm build

# 3. Start production server
pnpm start
```

## Configuration

### Enable Database Backups
1. Log in to Neon dashboard
2. Select your project
3. Enable automated backups
4. Set retention to 7 days

### Configure Monitoring
1. Create Sentry account
2. Create project for your app
3. Add SENTRY_DSN to environment
4. Enable session replay (optional)

### Set Up Health Checks
```bash
# Add to your monitoring service
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected",
  "version": { "now": "2024-01-15T10:30:00.000Z" }
}
```

## Production Security Best Practices

### 1. Keep Dependencies Updated
```bash
pnpm update
pnpm audit
```

### 2. Monitor Error Rates
- Check Sentry dashboard daily
- Set up alerts for error spikes
- Review error patterns weekly

### 3. Database Backups
- Automatic daily backups (Neon)
- Test restore procedures monthly
- Keep backups for 30 days

### 4. Rate Limiting
- Implemented on auth endpoints
- Monitor for abuse patterns
- Adjust thresholds based on usage

### 5. SSL/TLS Certificates
- Auto-renewed by Vercel
- No action required
- Monitor certificate expiration

## Scaling Considerations

### Database Optimization
- Indexes created for all query patterns
- Connection pooling enabled
- Query timeouts set

### Performance Optimization
- Next.js automatic code splitting
- Image optimization enabled
- CSS-in-JS optimized

### Load Balancing
- Vercel auto-scales Serverless Functions
- Database connection pooling handles load
- CDN caches static assets

## Disaster Recovery

### Database Failure
1. Neon maintains automatic backups
2. Contact Neon support for restoration
3. Typical restore time: < 1 hour

### Application Failure
1. Previous deployment automatically restored
2. Check error logs in Vercel dashboard
3. Rollback via Vercel deployment dashboard

### Data Corruption
1. Restore from Neon backup
2. Contact Neon support
3. Implement data validation checks

## Monitoring Commands

```bash
# Check application health
curl https://your-domain.com/api/health

# View Vercel logs
vercel logs

# Check Neon database status
# Via https://console.neon.tech/

# View error tracking
# Via Sentry dashboard
```

## Support & Troubleshooting

### Common Issues

**502 Bad Gateway**
- Check database connection
- Review recent deployments
- Check Vercel logs

**Authentication failures**
- Verify BETTER_AUTH_SECRET is set
- Check database session table
- Review Vercel logs

**Database connection errors**
- Verify DATABASE_URL is correct
- Check IP whitelist in Neon
- Verify network connectivity

### Getting Help
- Vercel Support: https://vercel.com/help
- Neon Support: https://neon.tech/docs/support
- GitHub Issues: Create detailed bug report
- Sentry Documentation: https://docs.sentry.io/

## Performance Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **API Response Time**: < 200ms
- **Database Query Time**: < 100ms

Monitor these via:
- Vercel Web Analytics
- Next.js Analytics
- Sentry Performance Monitoring
