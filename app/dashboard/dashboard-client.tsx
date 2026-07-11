'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StormDial } from '@/components/StormDial';
import { WeatherCard } from '@/components/WeatherCard';
import { ChecklistCard } from '@/components/ChecklistCard';
import { Card } from '@/components/Card';
import { getWeatherForLocation } from '@/lib/weather-engine';
import { generateAdvisories, calculatePreparednessScore } from '@/lib/advisory-engine';
import { Profile } from '@/lib/types';

interface User {
  id: string;
  name: string;
  email: string;
}

export function DashboardClient({ user }: { user: User }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [preparednessScore, setPreparednessScore] = useState(50);
  const [weather, setWeather] = useState<any>(null);
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.status === 404) {
          // No profile, redirect to onboarding
          router.push('/onboarding');
          return;
        }
        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile(data.profile);

        // Generate weather and advisories based on location
        const weatherData = getWeatherForLocation(data.profile.location);
        setWeather(weatherData);

        const score = calculatePreparednessScore(data.profile, weatherData);
        setPreparednessScore(score);

        const ads = generateAdvisories(data.profile, weatherData);
        setAdvisories(ads);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChecklistToggle = async (itemId: string) => {
    if (!profile) return;

    const updatedItems = profile.checklistItems.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklistItems: updatedItems }),
      });

      if (!response.ok) throw new Error('Failed to update checklist');

      setProfile({
        ...profile,
        checklistItems: updatedItems,
      });
    } catch (err) {
      console.error('Error updating checklist:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-700">{error || 'Profile not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-teal-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Your monsoon preparedness dashboard for {profile.location}
          </p>
        </div>

        {/* Preparedness Score & Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Storm Dial */}
          <div className="lg:col-span-1">
            <Card title="Your Preparedness" variant="primary">
              <div className="flex justify-center py-6">
                <StormDial score={preparednessScore} size="md" />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Based on your profile and current weather conditions
              </p>
            </Card>
          </div>

          {/* Weather Card */}
          {weather && (
            <div className="lg:col-span-2">
              <WeatherCard
                location={profile.location}
                currentWeather={{
                  condition: weather.condition,
                  temp: weather.temp,
                  humidity: weather.humidity,
                  windSpeed: weather.windSpeed,
                  rainfall: weather.rainfall,
                  floodRisk: weather.floodRisk,
                }}
                forecast={weather.forecast}
              />
            </div>
          )}
        </div>

        {/* Advisories */}
        {advisories.length > 0 && (
          <div className="mb-6">
            <Card title="Safety Advisories & Recommendations">
              <div className="space-y-3">
                {advisories.slice(0, 5).map((advisory, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      advisory.priority === 'critical'
                        ? 'bg-red-50 border-red-200'
                        : advisory.priority === 'high'
                        ? 'bg-orange-50 border-orange-200'
                        : advisory.priority === 'medium'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 text-lg ${
                          advisory.priority === 'critical'
                            ? 'text-red-600'
                            : advisory.priority === 'high'
                            ? 'text-orange-600'
                            : advisory.priority === 'medium'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {advisory.priority === 'critical'
                          ? '⚠️'
                          : advisory.priority === 'high'
                          ? '⚡'
                          : advisory.priority === 'medium'
                          ? 'ℹ️'
                          : '✓'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{advisory.category}</div>
                        <p className="text-sm text-gray-700">{advisory.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{advisory.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Checklist */}
        <div className="grid grid-cols-1 gap-6">
          <ChecklistCard
            items={profile.checklistItems}
            onToggle={handleChecklistToggle}
            compact={false}
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="default">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">
                {profile.checklistItems.filter(i => i.completed).length}/{profile.checklistItems.length}
              </div>
              <p className="text-sm text-gray-600 mt-2">Checklist Items</p>
            </div>
          </Card>

          <Card variant="primary">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{profile.householdSize}</div>
              <p className="text-sm text-gray-600 mt-2">Household Members</p>
            </div>
          </Card>

          <Card variant="warning">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">
                {profile.childrenCount || 0}
              </div>
              <p className="text-sm text-gray-600 mt-2">Children</p>
            </div>
          </Card>

          <Card variant="default">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">
                {weather?.floodRisk === 'low' ? '✓' : weather?.floodRisk === 'critical' ? '🚨' : '⚠️'}
              </div>
              <p className="text-sm text-gray-600 mt-2">Flood Risk</p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
