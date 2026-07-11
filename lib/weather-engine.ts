import { Profile } from './types';

export interface Weather {
  location: string;
  condition: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  floodRisk: 'low' | 'moderate' | 'high' | 'critical';
  forecast: Array<{
    day: string;
    condition: string;
    temp: number;
    rainfall: number;
    windSpeed: number;
    floodRisk: 'low' | 'moderate' | 'high' | 'critical';
  }>;
}

// Deterministic weather based on location hash
function seedRandom(seed: number): () => number {
  const x = Math.sin(seed) * 10000;
  return () => {
    const y = x * Math.sin(x);
    return y - Math.floor(y);
  };
}

export function getWeatherForLocation(location: string): Weather {
  // Generate consistent weather based on location
  const seed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rand = seedRandom(seed);

  const conditions = ['Partly Cloudy', 'Monsoon Rain', 'Heavy Rain', 'Thunderstorm', 'Scattered Showers'];
  const conditionIndex = Math.floor(rand() * conditions.length);
  const condition = conditions[conditionIndex];

  // Determine flood risk based on condition
  let floodRisk: 'low' | 'moderate' | 'high' | 'critical';
  if (condition === 'Thunderstorm') floodRisk = 'critical';
  else if (condition === 'Heavy Rain') floodRisk = 'high';
  else if (condition === 'Monsoon Rain' || condition === 'Scattered Showers') floodRisk = 'moderate';
  else floodRisk = 'low';

  // Generate weather data
  const temp = 22 + Math.floor(rand() * 15);
  const humidity = 60 + Math.floor(rand() * 40);
  const windSpeed = 10 + Math.floor(rand() * 40);
  const rainfall = Math.floor(rand() * 200);

  // Generate 5-day forecast
  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
  const forecast = days.map((day, idx) => {
    const forecastRand = seedRandom(seed + idx);
    const forecastConditionIdx = Math.floor(forecastRand() * conditions.length);
    const forecastCondition = conditions[forecastConditionIdx];

    let forecastRisk: 'low' | 'moderate' | 'high' | 'critical';
    if (forecastCondition === 'Thunderstorm') forecastRisk = 'critical';
    else if (forecastCondition === 'Heavy Rain') forecastRisk = 'high';
    else if (forecastCondition === 'Monsoon Rain' || forecastCondition === 'Scattered Showers')
      forecastRisk = 'moderate';
    else forecastRisk = 'low';

    return {
      day,
      condition: forecastCondition,
      temp: 20 + Math.floor(forecastRand() * 15),
      rainfall: Math.floor(forecastRand() * 150),
      windSpeed: 8 + Math.floor(forecastRand() * 35),
      floodRisk: forecastRisk,
    };
  });

  return {
    location,
    condition,
    temp,
    humidity,
    windSpeed,
    rainfall,
    floodRisk,
    forecast,
  };
}
