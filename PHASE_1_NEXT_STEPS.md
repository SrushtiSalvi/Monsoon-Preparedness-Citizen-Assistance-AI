# Phase 1 Next Steps - Dashboard & Real-time Features

Phase 1 foundation (authentication + profile) is complete. The following components are ready to be enhanced:

## Immediate Next Tasks

### 1. Implement Dashboard Client (`/app/dashboard/dashboard-client.tsx`)
Current: Placeholder with mock data
Next: 
- Fetch user profile with Drizzle query
- Display Storm Dial (preparedness gauge)
- Show weather for user's location
- Display top 5 recommendations
- Show checklist progress

### 2. Integrate Weather Engine (`/lib/weather-engine.ts`)
Current: Mock weather generator
Next:
- Connect to real weather API (OpenWeatherMap, WeatherAPI, etc.)
- Cache weather data in `weather_data` table
- Calculate flood risk based on location
- Return 5-day forecast

### 3. Build Advisory Engine (`/lib/advisory-engine.ts`)
Current: Rule-based heuristics (~12 rules)
Next:
- Generate personalized recommendations from rules
- Store top 5 recommendations per user
- Create advisory cache table (optional)
- Weight recommendations by risk level

### 4. Finalize Checklist System (`/components/ChecklistCard.tsx`)
Current: UI component rendering mock data
Next:
- Fetch checklist items from `checklist_item` table
- Implement toggle completion via server action
- Auto-generate checklist based on profile
- Show progress percentage
- Filter by category

### 5. Build Checkout Flow (`/app/onboarding/page.tsx`)
Current: Saves profile data
Next:
- Auto-generate initial checklist items after profile save
- Initialize weather data for user's location
- Calculate preparedness score
- Redirect to dashboard with fresh data

## Database Queries to Add

Create server actions in `/app/actions/`:

### `checklist.ts`
```typescript
- getChecklist(userId) → Filter by userId
- updateChecklistItem(id, completed) → Toggle completion
- generateDefaultChecklist(userId, profile) → Create defaults
- deleteChecklistItem(id)
```

### `weather.ts`
```typescript
- getWeatherForLocation(location) → From weather_data table
- updateWeather(userId, weatherData) → Insert/update
- calculateFloodRisk(rainfall, location) → Risk calculation
```

### `advisory.ts`
```typescript
- getRecommendations(userId, limit = 5) → Top recommendations
- generateAdvisories(profile, weather) → Rule-based generation
```

## Components to Enhance

### `StormDial.tsx`
- [ ] Accept `score: number` prop (0-100)
- [ ] Animate needle movement
- [ ] Show score label ("Moderate Risk", etc.)
- [ ] Add visual warning at high risk

### `WeatherCard.tsx`
- [ ] Fetch real weather data
- [ ] Show 5-day forecast
- [ ] Display flood risk indicators
- [ ] Update every 30 minutes (cache in DB)

### `ChecklistCard.tsx`
- [ ] Fetch from DB instead of mock
- [ ] Show progress bar
- [ ] Allow toggling items
- [ ] Group by category with collapse/expand

### `DashboardClient` (new)
- [ ] Orchestrate all components
- [ ] Handle loading states
- [ ] Show error messages gracefully
- [ ] Add refresh button for weather

## Quick Integration Pattern

All data fetching should follow this pattern:

```typescript
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
  return session.user.id;
}

export async function getMyData() {
  const userId = await getUserId();
  
  return db.query.myTable.findFirst({
    where: eq(myTable.userId, userId),
  });
}
```

## Testing Checklist

- [ ] Sign up creates profile
- [ ] Profile data displays correctly
- [ ] Weather updates after profile save
- [ ] Checklist generates with default items
- [ ] Storm Dial shows correct preparedness score
- [ ] Recommendations are personalized
- [ ] All data persists between sessions

## Estimated Effort

- Dashboard integration: 2-3 hours
- Weather engine real API: 2-3 hours
- Checklist system: 2 hours
- Advisory engine: 2 hours
- Total: ~8-12 hours for complete Phase 1

**Total Phase 1 status**: ~70% complete (authentication + foundation done, UI + data integration remaining)
