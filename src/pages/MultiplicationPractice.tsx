import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import LevelCompletionModal from '../components/LevelCompletionModal'
import EquationMatcher from '../components/EquationMatcher'
import WizardSprite from '../components/WizardSprite'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

export default function MultiplicationPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [isSuperado, setIsSuperado] = useState(false)
  const [sessionPoints, setSessionPoints] = useState(0)
  const [showIntro, setShowIntro] = useState(true)

  const handleLevelComplete = (totalPoints: number) => {
    setSessionPoints(totalPoints)
    recordResult(totalPoints, true)
    completeLevel('level2')
    setIsSuperado(true)
  }

  if (isSuperado) {
    return (
      <LevelCompletionModal 
        isOpen={true} 
        levelName="Multiplicaciones" 
        points={sessionPoints} 
      />
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-8 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        style={{ backgroundImage: 'url(/mathbg.png)' }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Reino</span>
        </button>

        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="card mt-12 overflow-hidden border-2 border-accent-yellow relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 p-8">
                {/* Wizard Sprite Container */}
                <div className="w-72 h-72 bg-dark-bg/50 rounded-[2.5rem] border-4 border-accent-yellow/20 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-accent-yellow/5 group-hover:bg-accent-yellow/10 transition-colors" />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10"
                  >
                    <WizardSprite 
                      spritePath={wizardIdle} 
                      width={260} 
                      height={260} 
                      scale={2.5} 
                    />
                  </motion.div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/40 rounded-[100%] blur-md" />
                </div>

                {/* Dialogue Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 mb-4 justify-center md:justify-start text-accent-yellow">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Maestro de la Isla</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white mb-6 leading-tight">
                    "Increíble, has llegado al Valle de las Multiplicaciones. Aquí los números crecen rápido, ¡necesitarás toda tu concentración!"
                  </h2>

                  <button
                    onClick={() => setShowIntro(false)}
                    className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter overflow-hidden"
                  >
                    <span className="relative z-10">¡Estoy listo!</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent-yellow/50 to-transparent" />
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent-yellow/50 to-transparent" />
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black gradient-text">Valle Multiplicación</h1>
                <p className="text-text-tertiary font-bold">Arrastra el número correcto para completar la multiplicación</p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card min-h-[500px] flex flex-col items-center justify-center border-t-8 border-accent-yellow bg-dark-card/80 backdrop-blur-sm"
              >
                <EquationMatcher 
                  operator="*"
                  totalRounds={10}
                  equationsPerRound={5}
                  onLevelComplete={handleLevelComplete}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
