'use client';

import React from 'react';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  progressColor?: string;
  textColor?: string;
  showText?: boolean;
}

export default function ProgressCircle({
  percentage,
  size = 80,
  strokeWidth = 8,
  circleColor = '#e5e7eb',
  progressColor = '#4f46e5',
  textColor = '#1f2937',
  showText = true,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (percentage * circumference) / 100;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="transition-all duration-300"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={circleColor}
          strokeWidth={strokeWidth}
        />
        <circle
          className="transition-all duration-300"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <div 
          className="absolute inset-0 flex items-center justify-center font-semibold"
          style={{ color: textColor }}
        >
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
} 