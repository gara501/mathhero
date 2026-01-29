import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Lock, CheckCircle2 } from 'lucide-react'
import { useUserStore } from '../store/userStore'

interface Level {
  id: string
  name: string
  path: string
}

const LEVELS: Level[] = [
  { id: 'level1', name: 'Sumas y Restas', path: '/practice/addition' },
  { id: 'level2', name: 'Multiplicaciones', path: '/practice/multiplication' },
  { id: 'level3', name: 'Divisiones', path: '/practice/division' },
  { id: 'level4', name: 'Fracciones', path: '/practice/fractions' },
  { id: 'level5', name: 'Maestro de Funciones', path: '/practice/functions' },
  { id: 'level6', name: 'Ordenamiento decimal', path: '/practice/sorting-decimals' },
  { id: 'level7', name: 'Reto Cartesiano', path: '/practice/cartesian' },
  { id: 'level8', name: 'Series Alternadas', path: '/practice/alternating' },
  { id: 'level9', name: 'Reto Decimales', path: '/practice/decimals' },
]

interface GameMapProps {
  range?: [number, number] // [start, end] 1-indexed
}

export default function GameMap({ range }: GameMapProps) {
  const navigate = useNavigate()
  const { completedLevels } = useUserStore()
  
  const displayLevels = range 
    ? LEVELS.slice(range[0] - 1, range[1])
    : LEVELS

  const isLevelUnlocked = (_id: string) => {
    return true // TEMPORAL: Todos los niveles activados
  }

  const isLevelCompleted = (id: string) => completedLevels.includes(id)

  return (
    <div className="relative w-full overflow-hidden font-mono flex flex-col items-center">
      {/* Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl px-4 py-8">
        {displayLevels.map((level) => {
          const globalIndex = LEVELS.findIndex(l => l.id === level.id)
          const unlocked = isLevelUnlocked(level.id)
          const completed = isLevelCompleted(level.id)

          return (
            <motion.div key={level.id} className="flex flex-col items-center gap-3">
              <motion.button
                whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
                whileTap={unlocked ? { scale: 0.95 } : {}}
                onClick={() => unlocked && navigate(level.path)}
                disabled={!unlocked}
                className={`
                  relative aspect-square w-full rounded-2xl flex items-center justify-center text-4xl font-black transition-all border-b-8
                  ${unlocked 
                    ? 'bg-white border-gray-300 text-gray-700 shadow-xl cursor-pointer hover:shadow-2xl' 
                    : 'bg-gray-600/80 border-gray-700 text-gray-400 cursor-not-allowed opacity-80 shadow-inner'
                  }
                `}
              >
                {unlocked ? (
                  <>
                    <span className="drop-shadow-sm">{globalIndex + 1}</span>
                    {completed && (
                      <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1 shadow-lg border-2 border-white">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </>
                ) : (
                  <Lock className="w-8 h-8 opacity-50" />
                )}
              </motion.button>
              
              <span className={`text-[10px] font-black uppercase text-center leading-tight h-8
                ${unlocked ? 'text-white' : 'text-white/20'}
              `}>
                {level.name}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

