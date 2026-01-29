import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  title: string
  description: string
  icon: LucideIcon
  formula?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  isHighlight?: boolean
  onClick?: () => void
}

export default function CategoryCard({
  title,
  description,
  icon: Icon,
  formula,
  difficulty,
  isHighlight = false,
  onClick,
}: CategoryCardProps) {
  const difficultyConfig = {
    easy: { label: 'Fácil', color: 'bg-green-500' },
    medium: { label: 'Medio', color: 'bg-orange-500' },
    hard: { label: 'Difícil', color: 'bg-red-500' },
  }

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-3xl p-6 cursor-pointer border
        transition-smooth
        ${isHighlight ? 'bg-accent-yellow text-dark-bg shadow-glow border-accent-yellow-dark' : 'card'}
      `}
      whileHover={{
        scale: 1.02,
        y: -8,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <div
        className={`
        w-14 h-14 rounded-2xl flex items-center justify-center mb-4
        ${isHighlight ? 'bg-dark-bg/10' : 'bg-gradient-to-br from-accent-yellow to-gradient-to'}
      `}
      >
        <Icon className={`w-7 h-7 ${isHighlight ? 'text-dark-bg' : 'text-white'}`} />
      </div>

      {/* Difficulty Badge */}
      {difficulty && (
        <div className="mb-3">
          <span
            className={`
              inline-block px-5 py-2 rounded-full text-sm font-semibold text-white
              ${difficultyConfig[difficulty].color}
            `}
          >
            {difficultyConfig[difficulty].label}
          </span>
        </div>
      )}

      {/* Content */}
      <h3
        className={`
        text-xl font-bold mb-2
        ${isHighlight ? 'text-dark-bg' : 'text-primary dark:text-tertiary'}
      `}
      >
        {title}
      </h3>

      <p
        className={`
        text-sm mb-3
        ${isHighlight ? 'text-dark-bg/70 dark:text-secondary' : 'text-secondary dark:text-secondary'}
      `}
      >
        {description}
      </p>

      {/* Formula */}
      {formula && (
        <div
          className={`
          mt-4 p-3 rounded-xl font-mono text-sm
          ${isHighlight ? 'bg-dark-bg/10 text-dark-bg dark:text-primary' : 'bg-dark-card/50 text-primary dark:text-tertiary'}
        `}
        >
          {formula}
        </div>
      )}

      {/* Decorative gradient overlay */}
      {!isHighlight && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br dark:bg-gradient-to-t from-accent-yellow/10 dark:from-accent-yellow/10 to-transparent dark:to-transparent rounded-full blur-2xl -z-10" />
      )}
    </motion.div>
  )
}
