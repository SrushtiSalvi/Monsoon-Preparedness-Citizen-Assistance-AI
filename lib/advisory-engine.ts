import { Profile } from './types';
import { Weather } from './weather-engine';

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && Boolean(item));
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export interface Advisory {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  text: string;
  reason: string;
}

export function generateAdvisories(profile: Profile, weather: Weather): Advisory[] {
  const advisories: Advisory[] = [];

  // Critical alerts based on flood risk
  if (weather.floodRisk === 'critical') {
    advisories.push({
      priority: 'critical',
      category: 'Evacuation',
      text: 'Prepare for immediate evacuation. Keep documents and valuables packed.',
      reason: 'Critical flood risk detected',
    });
  }

  // High-priority advisories
  if (weather.floodRisk === 'high') {
    advisories.push({
      priority: 'high',
      category: 'Safety',
      text: 'Avoid low-lying areas and waterlogged roads.',
      reason: 'High flood risk in forecast',
    });
  }

  // Weather-specific advisories
  if (weather.rainfall > 100) {
    advisories.push({
      priority: 'high',
      category: 'Water Safety',
      text: 'Heavy rainfall expected. Ensure drainage systems are clear.',
      reason: `${weather.rainfall}mm of rain forecasted`,
    });
  }

  if (weather.windSpeed > 40) {
    advisories.push({
      priority: 'high',
      category: 'Wind Safety',
      text: 'High wind speeds. Secure loose outdoor items.',
      reason: `Wind speeds up to ${weather.windSpeed} km/h`,
    });
  }

  // Family-specific advisories
  if (profile.householdSize && profile.householdSize > 5) {
    advisories.push({
      priority: 'medium',
      category: 'Planning',
      text: 'With a larger household, ensure evacuation routes for everyone.',
      reason: `Household size: ${profile.householdSize} people`,
    });
  }

  // Children in household
  if (profile.childrenCount && profile.childrenCount > 0) {
    advisories.push({
      priority: 'medium',
      category: 'Medical',
      text: 'Keep children indoors during peak rainfall. Prepare medicines.',
      reason: `${profile.childrenCount} children in household`,
    });
  }

  // Elderly members
  if (profile.elderlyMembers && profile.elderlyMembers > 0) {
    advisories.push({
      priority: 'medium',
      category: 'Elderly Care',
      text: 'Ensure elderly members have mobility aids and medications within reach.',
      reason: `${profile.elderlyMembers} elderly members`,
    });
  }

  // Health conditions
  const healthConditions = toStringArray((profile as any).healthConditions);
  if (healthConditions.length > 0) {
    advisories.push({
      priority: 'medium',
      category: 'Medical',
      text: 'Stock additional medications and health supplies for monitored conditions.',
      reason: `Health conditions: ${healthConditions.join(', ')}`,
    });
  }

  // Pets
  const pets = toStringArray((profile as any).pets);
  if (pets.length > 0) {
    advisories.push({
      priority: 'medium',
      category: 'Pet Care',
      text: 'Keep pet carriers accessible. Stock pet food and medications.',
      reason: `${pets.length} pets in household: ${pets.join(', ')}`,
    });
  }

  // Location-based advisories
  if (profile.homeType === 'low-lying' || profile.homeType === 'basement') {
    advisories.push({
      priority: 'high',
      category: 'Home Safety',
      text: 'Your home is in a flood-prone area. Have sandbags and barriers ready.',
      reason: `Home in ${profile.homeType} area`,
    });
  }

  if (profile.homeType === 'high-rise') {
    advisories.push({
      priority: 'medium',
      category: 'Wind Safety',
      text: 'High-rise units are exposed to strong winds. Secure all windows.',
      reason: 'Living in high-rise building',
    });
  }

  // Vehicle advisories
  if (profile.hasVehicle) {
    advisories.push({
      priority: 'medium',
      category: 'Vehicle Safety',
      text: 'Keep vehicle fueled and away from low-lying parking areas.',
      reason: 'Vehicle in household',
    });
  }

  // General preparedness based on risk level
  if (weather.floodRisk === 'moderate') {
    advisories.push({
      priority: 'low',
      category: 'Preparedness',
      text: 'Review your emergency kit and check all contact information.',
      reason: 'Moderate flood risk - good time to prepare',
    });
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  advisories.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return advisories.slice(0, 10); // Return top 10 advisories
}

export function calculatePreparednessScore(profile: Profile, weather: Weather): number {
  let score = 50; // Base score

  // Adjust based on profile completeness
  if (profile.location) score += 5;
  if (profile.householdSize) score += 5;
  if ((profile as any).childrenCount !== undefined || (profile as any).children !== undefined) score += 5;
  if ((profile as any).elderlyMembers !== undefined || (profile as any).elderly !== undefined) score += 5;
  if (toStringArray((profile as any).healthConditions).length > 0) score += 5;
  if (toStringArray((profile as any).pets).length > 0) score += 5;
  if (profile.homeType) score += 5;
  if ((profile as any).hasVehicle !== undefined) score += 5;

  // Adjust based on weather
  if (weather.floodRisk === 'low') score += 10;
  else if (weather.floodRisk === 'moderate') score -= 10;
  else if (weather.floodRisk === 'high') score -= 20;
  else if (weather.floodRisk === 'critical') score -= 30;

  // Cap between 0-100
  return Math.max(0, Math.min(100, score));
}
