import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, HelpCircle, X } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import LevelCompletionModal from '../components/LevelCompletionModal'
import EquationMatcher from '../components/EquationMatcher'
import WizardSprite from '../components/WizardSprite'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

export default function DivisionPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [isSuperado, setIsSuperado] = useState(false)
  const [sessionPoints, setSessionPoints] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const handleLevelComplete = (totalPoints: number) => {
    setSessionPoints(totalPoints)
    recordResult(totalPoints, true)
    completeLevel('level3')
    setIsSuperado(true)
  }

  if (isSuperado) {
    return (
      <LevelCompletionModal 
        isOpen={true} 
        levelName="Divisiones" 
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
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Reino</span>
          </button>

          {!showIntro && (
            <button
              onClick={() => setShowHelpModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 text-accent-yellow rounded-xl hover:bg-white/10 transition-all cursor-pointer border border-accent-yellow/20"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-bold hidden sm:inline">¿Necesitas Ayuda?</span>
            </button>
          )}
        </div>

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
                    "¡Increíble! Has llegado al Templo de la División. Aquí aprenderás a repartir el poder de los números equitativamente."
                  </h2>

                  <button
                    onClick={() => setShowIntro(false)}
                    className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10">¡Acepto el Reto!</span>
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
                <h1 className="text-4xl font-black gradient-text">Templo División</h1>
                <p className="text-text-tertiary font-bold">Arrastra el número correcto para completar la división</p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card min-h-[500px] flex flex-col items-center justify-center border-t-8 border-accent-yellow bg-dark-card/80 backdrop-blur-sm"
              >
                <EquationMatcher 
                  operator="/"
                  totalRounds={10}
                  equationsPerRound={5}
                  onLevelComplete={handleLevelComplete}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelpModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-2xl bg-dark-card rounded-[2.5rem] border-4 border-accent-yellow shadow-2xl relative overflow-hidden"
              >
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-tertiary hover:text-white transition-colors cursor-pointer z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                  <div className="flex items-center gap-3 text-accent-yellow mb-6">
                    <HelpCircle className="w-8 h-8" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Guía de División</h3>
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="p-6 bg-dark-bg/50 rounded-2xl border-2 border-white/5">
                      <p className="text-text-secondary dark:text-white/80 leading-relaxed mb-4">
                        Dividir es repartir un número en partes iguales. Es la operación contraria a la multiplicación.
                      </p>
                      <div className="bg-dark-bg p-4 rounded-xl border border-white/10 font-mono text-center">
                        <span className="text-accent-yellow">12 ÷ 3</span> = <span className="text-accent-yellow">4</span>
                        <div className="text-xs text-text-tertiary mt-1">Porque 4 x 3 = 12</div>
                      </div>
                    </div>

                    <div className="p-6 bg-accent-yellow/10 rounded-2xl border-2 border-accent-yellow/20">
                      <h4 className="font-black text-accent-yellow uppercase text-sm mb-2">Consejo del Mago</h4>
                      <p className="text-sm text-text-secondary dark:text-white/70 italic">
                        "¡Piensa en las multiplicaciones! Si sabes que 2 x 5 = 10, entonces sabrás que 10 ÷ 2 = 5 automáticamente."
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
