import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, ArrowRight, Sparkles, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface LevelCompletionModalProps {
  isOpen: boolean
  levelName: string
  points: number
  onClose?: () => void
}

export default function LevelCompletionModal({ 
  isOpen, 
  levelName, 
  points
}: LevelCompletionModalProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-dark-bg/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-dark-card border-4 border-accent-yellow rounded-[2.5rem] p-10 text-center shadow-[0_0_50px_rgba(244,224,77,0.3)] overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {[...Array(6)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ 
                   y: [-20, 400],
                   x: [Math.random() * 400, Math.random() * 400],
                   rotate: [0, 360],
                   opacity: [0, 1, 0]
                 }}
                 transition={{ 
                   duration: Math.random() * 3 + 2, 
                   repeat: Infinity,
                   ease: "linear",
                   delay: Math.random() * 2
                 }}
                 className="absolute -top-10 text-accent-yellow/20"
               >
                 <Sparkles size={20 + Math.random() * 20} />
               </motion.div>
             ))}
          </div>

          {/* Trophy & Header */}
          <div className="relative z-10 mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block p-6 bg-accent-yellow/10 rounded-full mb-6 border-2 border-accent-yellow/20"
            >
              <Trophy size={80} className="text-accent-yellow drop-shadow-[0_0_15px_rgba(244,224,77,0.5)]" />
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl font-black gradient-text mb-2 uppercase tracking-tighter">
                ¡Nivel Superado!
              </h1>
              <p className="text-tertiary font-bold tracking-widest text-xs uppercase opacity-60">
                Has conquistado el {levelName}
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-dark-bg/60 rounded-3xl p-6 border-2 border-white/5 mb-10 flex items-center justify-center gap-4 relative z-10"
          >
            <div className="text-center">
              <p className="text-secondary text-[10px] uppercase font-black mb-1 opacity-50">Puntos Ganados</p>
              <div className="flex items-center gap-2">
                <Star className="text-accent-yellow fill-accent-yellow w-5 h-5" />
                <span className="text-3xl font-black text-accent-yellow">+{points}</span>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="group relative w-full py-5 bg-accent-yellow text-dark-bg font-black rounded-2xl shadow-[0_10px_25px_rgba(244,224,77,0.4)] hover:shadow-[0_15px_35px_rgba(244,224,77,0.6)] transition-all flex items-center justify-center gap-3 uppercase tracking-wider relative z-10 overflow-hidden cursor-pointer"
          >
            <span className="relative z-10">Continuar al Mapa</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
            
            {/* Gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
