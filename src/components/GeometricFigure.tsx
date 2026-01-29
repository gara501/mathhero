import { motion } from 'framer-motion'

interface GeometricFigureProps {
  type: 'circle' | 'triangle' | 'square'
  size?: number
  color?: string
  className?: string
}

export default function GeometricFigure({ 
  type, 
  size = 48, 
  color = '#FFD700',
  className = '' 
}: GeometricFigureProps) {
  const renderShape = () => {
    switch (type) {
      case 'circle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill={color}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
            />
          </svg>
        )
      
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
            <polygon 
              points="50,10 90,85 10,85" 
              fill={color}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
            />
          </svg>
        )
      
      case 'square':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
            <rect 
              x="10" 
              y="10" 
              width="80" 
              height="80" 
              fill={color}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
            />
          </svg>
        )
      
      default:
        return null
    }
  }

  return renderShape()
}

// Motion wrapper for animated geometric figures
export function AnimatedGeometricFigure({ 
  type, 
  size = 48, 
  color = '#FFD700',
  className = '' 
}: GeometricFigureProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-block"
    >
      <GeometricFigure type={type} size={size} color={color} className={className} />
    </motion.div>
  )
}
