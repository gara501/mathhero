import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  trend?: number
  subtitle?: string
  icon?: React.ReactNode
}

export default function StatsCard({ title, value, trend, subtitle, icon }: StatsCardProps) {
  const isPositive = trend && trend > 0

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm dark:text-primary mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-primary dark:text-primary">{value}</h3>
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-yellow to-gradient-to flex items-center justify-center ml-4 dark:text-primary">
            {icon}
          </div>
        )}
      </div>

      {(trend !== undefined || subtitle) && (
        <div className="flex items-center gap-2 mt-3">
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
          {subtitle && <p className="text-xs text-tertiary">{subtitle}</p>}
        </div>
      )}
    </motion.div>
  )
}
