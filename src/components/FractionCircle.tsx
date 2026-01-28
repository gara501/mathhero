import React from 'react'

interface FractionCircleProps {
  numerator: number
  denominator: number
  size?: number
  activeColor?: string
  inactiveColor?: string
  strokeColor?: string
}

export default function FractionCircle({
  numerator,
  denominator,
  size = 200,
  activeColor = '#f03434ff', // accent-yellow
  inactiveColor = 'rgba(255, 255, 255, 0.1)',
  strokeColor = 'rgba(3, 1, 1, 0.2)'
}: FractionCircleProps) {
  const radius = size / 2 - 10
  const center = size / 2

  const getPathData = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle)
    const end = polarToCartesian(center, center, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    return [
      'M', center, center,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      'L', center, center
    ].join(' ')
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  const segments = []
  const anglePerSegment = 360 / denominator

  for (let i = 0; i < denominator; i++) {
    const startAngle = i * anglePerSegment
    const endAngle = (i + 1) * anglePerSegment
    segments.push(
      <path
        key={i}
        d={getPathData(startAngle, endAngle)}
        fill={i < numerator ? activeColor : inactiveColor}
        stroke={strokeColor}
        strokeWidth="2"
      />
    )
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={center} cy={center} r={radius} fill="none" stroke={strokeColor} strokeWidth="4" />
      {segments}
    </svg>
  )
}
