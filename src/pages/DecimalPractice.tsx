import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Sparkles, HelpCircle, X } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import WizardSprite from '../components/WizardSprite'
import LevelCompletionModal from '../components/LevelCompletionModal'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

interface DecimalProblem {
  num1: number
  num2: number
  answer: number
}

export default function DecimalPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [problem, setProblem] = useState<DecimalProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isSuperado, setIsSuperado] = useState(false)
  const [problemClosed, setProblemClosed] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const generateProblem = () => {
    const n1 = Math.floor(Math.random() * 100) / 10
    const n2 = Math.floor(Math.random() * 100) / 10
    const ans = parseFloat((n1 + n2).toFixed(1))

    setProblem({ num1: n1, num2: n2, answer: ans })
    setUserAnswer('')
    setFeedback(null)
    setProblemClosed(false)
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const checkAnswer = () => {
    if (!problem || problemClosed) return

    const userNum = parseFloat(userAnswer)
    if (Math.abs(userNum - problem.answer) < 0.01) {
      setFeedback('correct')
      setProblemClosed(true)
      recordResult(10, true)
      
      const newCount = correctCount + 1
      setCorrectCount(newCount)
      
      if (newCount >= 10) {
        completeLevel('level9') // Corrected to level9 according to GameMap
        setTimeout(() => setIsSuperado(true), 1000)
      }
    } else {
      setFeedback('incorrect')
      recordResult(0, false)
    }
  }

  if (isSuperado) {
    return (
      <LevelCompletionModal 
        isOpen={true} 
        levelName="Reto Decimal" 
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
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-secondary dark:text-secondary hover:dark:text-white cursor-pointer hover:text-primary transition-colors"
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
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 mb-4 justify-center md:justify-start text-accent-yellow">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Maestro de los Decimales</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-6 leading-tight">
                    "Los decimales son números de gran precisión. Un pequeño error puede cambiarlo todo. ¿Tienes la precisión de un gran mago?"
                  </h2>

                  <button
                    onClick={() => setShowIntro(false)}
                    className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10">¡Iniciar Prueba!</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Reto Decimal</h1>
                  <p className="text-tertiary">Suma con precisión los números decimales</p>
                </div>
                <div className="card !py-2 !px-4">
                  <p className="text-xs text-tertiary uppercase tracking-widest mb-1">Poder Acumulado</p>
                  <p className="text-2xl font-bold text-accent-yellow">{correctCount} <span className="text-sm text-secondary">/ 10</span></p>
                </div>
              </div>

              <motion.div 
                className="card min-h-[400px] flex flex-col items-center justify-center border-t-8 border-accent-yellow"
              >
                {problem && (
                  <div className="w-full text-center p-4">
                    <div className="mb-12">
                      <div className="flex items-center justify-center gap-8 text-5xl md:text-7xl font-black text-primary dark:text-white">
                        <span>{problem.num1}</span>
                        <span className="text-accent-yellow">+</span>
                        <span>{problem.num2}</span>
                      </div>
                    </div>

                    <div className="max-w-md mx-auto space-y-6">
                      {!problemClosed ? (
                        <>
                          <input
                            type="number"
                            step="0.1"
                            value={userAnswer}
                            onChange={(e) => {
                              setUserAnswer(e.target.value)
                              if (feedback === 'incorrect') setFeedback(null)
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                            placeholder="Resultado decimal..."
                            className="w-full h-16 bg-dark-bg border-4 border-white/10 rounded-2xl px-6 text-3xl font-bold text-center focus:border-accent-yellow outline-none transition-all dark:text-white"
                            autoFocus
                          />

                          <button
                            onClick={checkAnswer}
                            disabled={!userAnswer}
                            className="w-full h-14 bg-accent-yellow text-dark-bg font-black rounded-xl hover:shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-tighter"
                          >
                            Lanzar Hechizo
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={generateProblem}
                          className="px-10 py-4 bg-gradient-to-r from-accent-yellow to-orange-400 text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all flex items-center gap-2 mx-auto cursor-pointer uppercase tracking-tighter"
                        >
                          <RefreshCw className="w-6 h-6" />
                          Siguiente Prueba
                        </button>
                      )}

                      <AnimatePresence>
                        {feedback && (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`p-6 rounded-2xl flex items-center justify-center gap-3 ${
                              feedback === 'correct' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                            }`}
                          >
                            {feedback === 'correct' ? (
                              <><CheckCircle className="w-6 h-6" /> <span className="text-xl font-bold">¡Precisión de maestro! El {problem.answer} es correcto.</span></>
                            ) : (
                              <><XCircle className="w-6 h-6" /> <span className="text-xl font-bold">Casi... ¡Afina tu puntería e intenta de nuevo!</span></>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
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
                  className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-tertiary hover:text-white transition-colors cursor-pointer z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                  <div className="flex items-center gap-3 text-accent-yellow mb-6">
                    <HelpCircle className="w-8 h-8" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Guía de Decimales</h3>
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="p-6 bg-dark-bg/50 rounded-2xl border-2 border-white/5">
                      <h4 className="text-lg font-bold text-accent-yellow mb-2">Comas vs Puntos</h4>
                      <p className="text-secondary dark:text-white/80 leading-relaxed mb-4">
                        En matemáticas digitales, usamos el punto (.) para separar la parte entera de la parte decimal (décimos, centésimos...).
                      </p>
                      
                      <h4 className="text-lg font-bold text-accent-yellow mb-2">Suma de Decimales</h4>
                      <p className="text-secondary dark:text-white/80 leading-relaxed">
                        Es igual que sumar números normales, solo asegúrate de alinear bien los puntos.
                        <br/>Ejemplo: 1.5 + 2.3 = 3.8
                      </p>
                    </div>

                    <div className="p-6 bg-accent-yellow/10 rounded-2xl border-2 border-accent-yellow/20">
                      <h4 className="font-black text-accent-yellow uppercase text-sm mb-2">Consejo del Mago</h4>
                      <p className="text-sm text-secondary dark:text-white/70 italic">
                        "¡No olvides el punto! Sin él, la magnitud del número cambia por completo. Los centavos en el tesoro agradecen tu precisión."
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
