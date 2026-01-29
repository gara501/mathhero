import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { MapPin, X, Lock, CheckCircle2 } from 'lucide-react'
import mapImg from '../assets/map.jpg'
import GameMap from './GameMap'
import { useUserStore } from '../store/userStore'

interface World {
  id: string
  name: string
  description: string
  x: string
  y: string
  levelRange: [number, number] // [start, end] indices (1-indexed)
}

const WORLDS: World[] = [
  { 
    id: 'world1', 
    name: 'Praderas del cálculo', 
    description: 'Domina las bases del cálculo mágico: Sumas, Restas, Multiplicaciones, divisiones y fraccionarios.',
    x: '20%', y: '70%', 
    levelRange: [1, 4] 
  },
  { 
    id: 'world2', 
    name: 'Tumbas de de las cifras', 
    description: 'Aprende a dominar la realidad con secuencias aritmeticas.',
    x: '45%', y: '60%', 
    levelRange: [5, 7] 
  },
  { 
    id: 'world3', 
    name: 'Desierto Decimal', 
    description: 'Enfréntate a los decimales y los porcentajes.',
    x: '70%', y: '75%', 
    levelRange: [8, 10] 
  },
  { 
    id: 'world4', 
    name: 'Frio Geometrico', 
    description: 'Domina las formas y los espacios.',
    x: '75%', y: '35%', 
    levelRange: [11, 13] 
  },
  { 
    id: 'world5', 
    name: 'Volcan de los Retos Matematicos', 
    description: 'El desafío final. Los secretos del universo matemático te esperan.',
    x: '40%', y: '25%', 
    levelRange: [14, 16] 
  },
]

export default function WorldMap() {
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null)
  const { completedLevels } = useUserStore()

  const isWorldUnlocked = (index: number) => {
    if (index === 0) return true
    const previousWorldRange = WORLDS[index - 1].levelRange
    const requiredLevelId = `level${previousWorldRange[1]}`
    return completedLevels.includes(requiredLevelId)
  }

  const isWorldCompleted = (world: World) => {
    for (let i = world.levelRange[0]; i <= world.levelRange[1]; i++) {
        if (!completedLevels.includes(`level${i}`)) return false
    }
    return true
  }

  return (
    <div className="relative w-full aspect-[12/10] max-h-[1000px] overflow-hidden rounded-[2rem] border-8 border-dark-card shadow-2xl bg-dark-bg">
      {/* Map Background */}
      <img src={mapImg} alt="World Map" className="w-full h-full  opacity-80" />
      
      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/40 to-transparent pointer-events-none" />

      {/* World Markers */}
      {WORLDS.map((world, index) => {
        const unlocked = isWorldUnlocked(index)
        const completed = isWorldCompleted(world)

        return (
          <motion.div
            key={world.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: world.x, top: world.y }}
          >
            <button
              onClick={() => unlocked && setSelectedWorld(world)}
              className={`
                group relative flex flex-col items-center gap-2
                ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
            >
              <div className={`
                relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                ${unlocked 
                  ? 'bg-accent-yellow shadow-glow-yellow scale-110 group-hover:scale-125' 
                  : 'bg-gray-700/80 grayscale'}
              `}>
                {unlocked ? (
                  completed ? <CheckCircle2 className="w-6 h-6 text-dark-bg" /> : <MapPin className="w-6 h-6 text-dark-bg" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                
                {/* Ping Effect for locked or highlighted */}
                {unlocked && !completed && (
                    <div className="absolute inset-0 rounded-full bg-accent-yellow animate-ping opacity-20" />
                )}
              </div>

              <div className={`
                px-3 py-1 rounded-lg border-2 whitespace-nowrap backdrop-blur-md transition-all
                ${unlocked 
                    ? 'bg-dark-bg/80 border-accent-yellow text-accent-yellow scale-100 group-hover:scale-110' 
                    : 'bg-gray-800/80 border-gray-700 text-gray-500 scale-90'}
              `}>
                <span className="text-md font-black uppercase">{world.name}</span>
              </div>
            </button>
          </motion.div>
        )
      })}

      {/* Level Selector Modal */}
      <AnimatePresence>
        {selectedWorld && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-dark-card rounded-3xl border-4 border-accent-yellow shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedWorld(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-tertiary hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-accent-yellow uppercase tracking-tighter flex items-center gap-3">
                    <MapPin className="w-8 h-8" />
                    {selectedWorld.name}
                  </h3>
                  <p className="text-secondary mt-2">{selectedWorld.description}</p>
                </div>

                <div className="bg-dark-bg/50 rounded-2xl p-6 border-2 border-white/5">
                  <GameMap range={selectedWorld.levelRange} />
                </div>
              </div>

              {/* Decorative side bar */}
              <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent-yellow/50 to-transparent" />
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent-yellow/50 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
