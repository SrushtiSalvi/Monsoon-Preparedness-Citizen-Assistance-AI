'use client';

export interface StormDialProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

export function StormDial({ score, size = 'md' }: StormDialProps) {
  // Clamp score between 0-100
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Color based on score
  const getColor = (value: number) => {
    if (value < 25) return 'text-green-600';
    if (value < 50) return 'text-yellow-600';
    if (value < 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getLabel = (value: number) => {
    if (value < 25) return 'Low Risk';
    if (value < 50) return 'Moderate Risk';
    if (value < 75) return 'High Risk';
    return 'Critical Risk';
  };

  const sizes = {
    sm: { outer: 120, inner: 100, textSize: 'text-2xl' },
    md: { outer: 160, inner: 140, textSize: 'text-4xl' },
    lg: { outer: 200, inner: 160, textSize: 'text-5xl' },
  };

  const { outer, inner, textSize } = sizes[size];
  const circumference = 2 * Math.PI * (inner / 2);
  const strokeOffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: outer, height: outer }}>
        {/* SVG Dial */}
        <svg className="absolute inset-0" width={outer} height={outer} viewBox={`0 0 ${outer} ${outer}`}>
          {/* Background circle */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={inner / 2}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={inner / 2}
            fill="none"
            stroke={getColor(normalizedScore).replace('text-', '').replace('-600', '')}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            transform={`rotate(-90 ${outer / 2} ${outer / 2})`}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold ${textSize} ${getColor(normalizedScore)}`}>
            {normalizedScore}
          </div>
          <div className="text-xs font-medium text-gray-600">Score</div>
        </div>
      </div>

      {/* Label below */}
      <div className={`text-center font-semibold ${getColor(normalizedScore)}`}>
        {getLabel(normalizedScore)}
      </div>
    </div>
  );
}
