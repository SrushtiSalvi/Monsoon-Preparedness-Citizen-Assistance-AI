'use client';

import { Card } from './Card';

export interface WeatherDay {
  day: string;
  condition: string;
  temp: number;
  rainfall: number;
  windSpeed: number;
  floodRisk: 'low' | 'moderate' | 'high' | 'critical';
}

export interface WeatherCardProps {
  location: string;
  currentWeather: {
    condition: string;
    temp: number;
    humidity: number;
    windSpeed: number;
    rainfall: number;
    floodRisk: 'low' | 'moderate' | 'high' | 'critical';
  };
  forecast: WeatherDay[];
}

export function WeatherCard({ location, currentWeather, forecast }: WeatherCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card title="Weather & Flood Risk" subtitle={location}>
      {/* Current Weather */}
      <div className="mb-6 p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-100">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-gray-900">{currentWeather.temp}°C</div>
            <div className="text-sm text-gray-600">{currentWeather.condition}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl">💧 {currentWeather.humidity}%</div>
            <div className="text-sm text-gray-600">Humidity</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Wind Speed</div>
            <div className="font-semibold text-gray-900">{currentWeather.windSpeed} km/h</div>
          </div>
          <div>
            <div className="text-gray-600">Rainfall</div>
            <div className="font-semibold text-gray-900">{currentWeather.rainfall} mm</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-teal-100">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(
            currentWeather.floodRisk
          )}`}>
            {currentWeather.floodRisk.charAt(0).toUpperCase() + currentWeather.floodRisk.slice(1)} Flood Risk
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">5-Day Forecast</h4>
        <div className="grid grid-cols-5 gap-2">
          {forecast.map((day, idx) => (
            <div
              key={idx}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center text-sm"
            >
              <div className="font-medium text-gray-900 mb-2">{day.day}</div>
              <div className="text-xs text-gray-600 mb-2">{day.condition}</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">{day.temp}°</div>
              <div className={`text-xs px-2 py-1 rounded ${getRiskColor(day.floodRisk)}`}>
                {day.floodRisk === 'low' ? '✓' : '!'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
