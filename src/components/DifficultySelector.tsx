import { motion } from 'framer-motion'

type Difficulty = 'easy' | 'medium' | 'hard'

interface DifficultySelectorProps {
  selected: Difficulty
  onSelect: (difficulty: Difficulty) => void
}

const difficulties: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Fácil', color: 'from-green-400 to-emerald-500' },
  { value: 'medium', label: 'Medio', color: 'from-yellow-400 to-orange-500' },
  { value: 'hard', label: 'Difícil', color: 'from-red-400 to-rose-500' },
]

export default function DifficultySelector({ selected, onSelect }: DifficultySelectorProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-text-primary">Dificultad</h3>
      <div className="flex gap-3">
        {difficulties.map(({ value, label, color }) => (
          <motion.button
            key={value}
            onClick={() => onSelect(value)}
            className={`
              flex-1 py-3 px-4 rounded-xl font-medium transition-smooth
              ${
                selected === value
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'bg-dark-card/50 text-text-secondary hover:bg-dark-card-hover'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export type { Difficulty }
