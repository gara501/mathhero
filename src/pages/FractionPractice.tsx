import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, CheckCircle, XCircle } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import LevelCompletionModal from '../components/LevelCompletionModal'
import FractionCircle from '../components/FractionCircle'
import WizardSprite from '../components/WizardSprite'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

interface FractionProblem {
  numerator: number
  denominator: number
  options: string[]
}

export default function FractionPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [problem, setProblem] = useState<FractionProblem | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isSuperado, setIsSuperado] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const generateProblem = useCallback(() => {
    const denominator = Math.floor(Math.random() * 7) + 2 // 2 to 8
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1 // 1 to denominator-1
    
    const correctAnswer = `${numerator}/${denominator}`
    const optionsSet = new Set<string>([correctAnswer])
    
    while (optionsSet.size < 4) {
      const d = Math.floor(Math.random() * 7) + 2
      const n = Math.floor(Math.random() * (d - 1)) + 1
      optionsSet.add(`${n}/${d}`)
    }
    
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5)
    
    setProblem({ numerator, denominator, options })
    setFeedback(null)
    setIsProcessing(false)
  }, [])

  useEffect(() => {
    generateProblem()
  }, [generateProblem])

  const handleOptionClick = (option: string) => {
    if (isProcessing || !problem) return
    setIsProcessing(true)

    if (option === `${problem.numerator}/${problem.denominator}`) {
      setFeedback('correct')
      recordResult(10, true)
      const newCount = correctCount + 1
      setCorrectCount(newCount)
      
      if (newCount >= 10) {
        completeLevel('level4')
        setTimeout(() => setIsSuperado(true), 1500)
      } else {
        setTimeout(generateProblem, 1500)
      }
    } else {
      setFeedback('incorrect')
      recordResult(0, false)
      setTimeout(() => {
        setFeedback(null)
        setIsProcessing(false)
      }, 1500)
    }
  }

  if (isSuperado) {
    return (
      <LevelCompletionModal 
        isOpen={true} 
        levelName="Fracciones" 
        points={correctCount * 10} 
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
                <div className="w-72 h-72 bg-dark-bg/50 rounded-[2.5rem] border-4 border-accent-yellow/20 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-accent-yellow/5 group-hover:bg-accent-yellow/10 transition-colors" />
                  <WizardSprite spritePath={wizardIdle} width={260} height={260} scale={2.5} />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/40 rounded-[100%] blur-md" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 mb-4 justify-center md:justify-start text-accent-yellow">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Maestro de la Isla</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white mb-6 leading-tight">
                    "¡Bienvenido al Círculo de las Fracciones! Aquí aprenderás que los números también pueden ser partes de un todo. ¿Podrás identificar la fracción correcta?"
                  </h2>

                  <button
                    onClick={() => setShowIntro(false)}
                    className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter"
                  >
                    <span className="relative z-10">¡Entendido!</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black gradient-text uppercase tracking-tighter">Fracciones</h1>
                <p className="text-text-tertiary font-bold lowercase">Observa el círculo y elige la fracción que representa la parte coloreada</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-3xl">
                {/* Fraction Display */}
                <div className="flex justify-center bg-dark-card/60 rounded-[3rem] p-12 border-4 border-white/5 shadow-2xl">
                  {problem && (
                    <FractionCircle 
                      numerator={problem.numerator} 
                      denominator={problem.denominator} 
                      size={240}
                    />
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  {problem?.options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={isProcessing}
                      onClick={() => handleOptionClick(opt)}
                      className={`
                        h-24 bg-dark-bg/60 border-2 rounded-3xl text-3xl font-black transition-all
                        ${feedback === 'correct' && opt === `${problem.numerator}/${problem.denominator}`
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : feedback === 'incorrect' && opt !== `${problem.numerator}/${problem.denominator}`
                            ? 'border-red-500/20 opacity-50'
                            : 'border-border-color hover:border-accent-yellow hover:scale-105 text-text-primary dark:text-white cursor-pointer'
                        }
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-12 p-6 rounded-2xl flex items-center gap-4 border-2 ${
                      feedback === 'correct' 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {feedback === 'correct' ? <CheckCircle /> : <XCircle />}
                    <span className="font-black uppercase tracking-widest text-lg">
                      {feedback === 'correct' ? '¡Excelente! +10 puntos' : '¡Inténtalo de nuevo!'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress */}
              <div className="mt-12 bg-white/5 px-8 py-3 rounded-full border border-white/10">
                <span className="text-text-tertiary font-bold uppercase text-xs tracking-widest mr-4 opacity-50">PROGRESO</span>
                <span className="text-accent-yellow font-black text-xl">{correctCount} / 10</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
