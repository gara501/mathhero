import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Lock, CheckCircle2, ChevronLeft } from 'lucide-react'
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
  { id: 'level5', name: 'Reto Decimales', path: '/practice/decimals' },
  { id: 'level6', name: 'Nivel 6', path: '/dashboard' },
  { id: 'level7', name: 'Nivel 7', path: '/dashboard' },
  { id: 'level8', name: 'Nivel 8', path: '/dashboard' },
  { id: 'level9', name: 'Nivel 9', path: '/dashboard' },
  { id: 'level10', name: 'Nivel 10', path: '/dashboard' },
  { id: 'level11', name: 'Nivel 11', path: '/dashboard' },
  { id: 'level12', name: 'Nivel 12', path: '/dashboard' },
  { id: 'level13', name: 'Nivel 13', path: '/dashboard' },
  { id: 'level14', name: 'Nivel 14', path: '/dashboard' },
  { id: 'level15', name: 'Nivel 15', path: '/dashboard' },
]

export default function GameMap() {
  const navigate = useNavigate()
  const { completedLevels } = useUserStore()
  
  const isLevelUnlocked = (index: number) => {
    if (index === 0) return true
    const currentLevelId = LEVELS[index].id
    const previousLevelId = LEVELS[index - 1].id
    return completedLevels.includes(currentLevelId) || completedLevels.includes(previousLevelId)
  }

  const isLevelCompleted = (id: string) => completedLevels.includes(id)

  return (
    <div className="relative min-h-[600px] w-full bg-[#87CEEB] rounded-3xl overflow-hidden border-8 border-dark-card shadow-2xl flex flex-col font-mono">
      {/* Pixel Art Style Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sky / Clouds */}
        <div className="absolute top-10 left-10 w-32 h-8 bg-white/40 blur-xl rounded-full" />
        <div className="absolute top-20 right-20 w-48 h-10 bg-white/30 blur-2xl rounded-full" />
        
        {/* Mountains Silhouette */}
        <div 
          className="absolute bottom-32 inset-x-0 h-64 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to top, #4a4a4a 0%, transparent 100%), 
              repeating-linear-gradient(45deg, #4a4a4a 0, #4a4a4a 40px, transparent 40px, transparent 80px)`
          }}
        />

        {/* Ground */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-[#cd853f] border-t-8 border-[#228b22]" />
      </div>

      {/* Content Header */}
      <div className="relative z-10 p-8 flex flex-col items-center">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 border-4 border-gray-400 px-12 py-3 rounded-xl shadow-xl mb-12"
        >
          <h2 className="text-2xl font-black text-gray-700 uppercase tracking-widest">
            Selecciona un nivel
          </h2>
        </motion.div>

        {/* Levels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-4xl w-full px-4 mb-20">
          {LEVELS.map((level, index) => {
            const unlocked = isLevelUnlocked(index)
            const completed = isLevelCompleted(level.id)

            return (
              <motion.button
                key={level.id}
                whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
                whileTap={unlocked ? { scale: 0.95 } : {}}
                onClick={() => unlocked && navigate(level.path)}
                disabled={!unlocked}
                className={`
                  relative aspect-square rounded-2xl flex items-center justify-center text-4xl font-black transition-all border-b-8
                  ${unlocked 
                    ? 'bg-white border-gray-300 text-gray-700 shadow-xl cursor-pointer hover:shadow-2xl' 
                    : 'bg-gray-600/80 border-gray-700 text-gray-400 cursor-not-allowed opacity-80 shadow-inner'
                  }
                `}
              >
                {unlocked ? (
                  <>
                    <span className="drop-shadow-sm">{index + 1}</span>
                    {completed && (
                      <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1 shadow-lg border-2 border-white">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </>
                ) : (
                  <Lock className="w-8 h-8 opacity-50" />
                )}

                {/* State Label */}
                {completed && (
                  <div className="absolute -bottom-2 bg-green-600 text-[10px] text-white px-2 py-0.5 rounded-full border border-white whitespace-nowrap">
                    SUPERADO
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto relative z-10 p-8 flex justify-center">
       <h4 className="text-xl font-black text-gray-700 uppercase tracking-widest">Debes superar los niveles anteriores para desbloquear los siguientes</h4>
      </div>
    </div>
  )
}
