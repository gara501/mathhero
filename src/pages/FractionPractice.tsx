import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Sparkles, HelpCircle, X } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import WizardSprite from '../components/WizardSprite'
import LevelCompletionModal from '../components/LevelCompletionModal'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

type VisualType = 'grid' | 'circle' | 'bar' | 'triangles'

interface FractionProblem {
  numerator: number
  denominator: number
  type: VisualType
  config?: { rows: number; cols: number }
  options: string[]
  id: string
}

const VISUAL_TYPES: VisualType[] = ['grid', 'circle', 'bar', 'triangles']

// Helper to get GCD
const getGCD = (a: number, b: number): number => b === 0 ? a : getGCD(b, a % b)

export default function FractionPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [problem, setProblem] = useState<FractionProblem | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isSuperado, setIsSuperado] = useState(false)
  const [problemClosed, setProblemClosed] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const generateProblem = useCallback(() => {
    let type: VisualType = VISUAL_TYPES[Math.floor(Math.random() * VISUAL_TYPES.length)]
    let numerator = 1
    let denominator = 1
    let config: { rows: number; cols: number } | undefined

    if (type === 'grid') {
      const rows = Math.floor(Math.random() * 3) + 2 // 2-4
      const cols = Math.floor(Math.random() * 3) + 2 // 2-4
      denominator = rows * cols
      config = { rows, cols }
    } else if (type === 'circle') {
      const options = [3, 4, 6, 8, 10, 12]
      denominator = options[Math.floor(Math.random() * options.length)]
    } else if (type === 'bar') {
      denominator = Math.floor(Math.random() * 7) + 3 // 3-9
    } else if (type === 'triangles') {
      denominator = 8 // Fixed for this specific visual
    }

    numerator = Math.floor(Math.random() * (denominator - 1)) + 1
    
    const id = `${type}-${numerator}-${denominator}`
    
    // Avoid repeats
    if (history.includes(id) && history.length < 15) {
      generateProblem()
      return
    }

    const correctOption = `${numerator}/${denominator}`
    const optionsSet = new Set<string>([correctOption])

    // Generate distractors
    while (optionsSet.size < 3) {
      const mode = Math.random()
      let dN = numerator
      let dD = denominator

      if (mode < 0.33) {
        // Same numerator, different denominator
        dD = Math.max(2, denominator + (Math.floor(Math.random() * 5) - 2))
      } else if (mode < 0.66) {
        // Same denominator, different numerator
        dN = Math.max(1, numerator + (Math.floor(Math.random() * 5) - 2))
        dN = Math.min(dN, dD - 1)
      } else {
        // Random
        dD = Math.floor(Math.random() * 10) + 2
        dN = Math.floor(Math.random() * (dD - 1)) + 1
      }

      const opt = `${dN}/${dD}`
      if (opt !== correctOption) {
        optionsSet.add(opt)
      }
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5)

    setProblem({ numerator, denominator, type, config, options, id })
    setHistory(prev => [...prev.slice(-10), id])
    setFeedback(null)
    setProblemClosed(false)
  }, [history])

  useEffect(() => {
    generateProblem()
  }, [])

  const handleOptionClick = (option: string) => {
    if (!problem || problemClosed) return

    setFeedback(null) // Clear previous feedback

    const correct = option === `${problem.numerator}/${problem.denominator}`
    
    if (correct) {
      setFeedback('correct')
      setProblemClosed(true)
      recordResult(10, true)
      
      const newCount = correctCount + 1
      setCorrectCount(newCount)
      
      if (newCount >= 10) {
        completeLevel('level4')
        setTimeout(() => setIsSuperado(true), 1000)
      }
    } else {
      setFeedback('incorrect')
      recordResult(0, false)
    }
  }

  const renderVisual = () => {
    if (!problem) return null

    const { type, numerator, denominator, config } = problem

    if (type === 'bar') {
      return (
        <div className="flex gap-1 w-full max-w-md mx-auto h-20 bg-dark-bg/20 border-4 border-dark-bg rounded-xl overflow-hidden p-1 shadow-inner">
          {Array.from({ length: denominator }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex-1 rounded-sm shadow-sm transition-colors duration-500 ${
                i < numerator ? 'bg-accent-yellow shadow-glow-yellow' : 'bg-white/10 dark:bg-white/5'
              }`}
            />
          ))}
        </div>
      )
    }

    if (type === 'grid' && config) {
      return (
        <div 
          className="grid gap-2 p-2 bg-dark-bg/20 border-4 border-dark-bg rounded-2xl mx-auto shadow-inner"
          style={{ 
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
            width: 'fit-content',
            minWidth: '200px'
          }}
        >
          {Array.from({ length: denominator }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-lg shadow-sm transition-colors duration-500 ${
                i < numerator ? 'bg-accent-yellow shadow-glow-yellow' : 'bg-white/10 dark:bg-white/5'
              }`}
            />
          ))}
        </div>
      )
    }

    if (type === 'circle') {
      return (
        <div className="relative w-56 h-56 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-dark-bg opacity-30" />
            {Array.from({ length: denominator }).map((_, i) => {
              const startAngle = (360 / denominator) * i - 90
              const endAngle = (360 / denominator) * (i + 1) - 90
              const x1 = 50 + 46 * Math.cos((startAngle * Math.PI) / 180)
              const y1 = 50 + 46 * Math.sin((startAngle * Math.PI) / 180)
              const x2 = 50 + 46 * Math.cos((endAngle * Math.PI) / 180)
              const y2 = 50 + 46 * Math.sin((endAngle * Math.PI) / 180)
              
              const largeArcFlag = 0
              const d = `M 50 50 L ${x1} ${y1} A 46 46 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

              return (
                <motion.path
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  d={d}
                  fill={i < numerator ? '#ffcc00' : 'rgba(255,255,255,0.05)'}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-dark-bg transition-colors duration-500"
                />
              )
            })}
          </svg>
        </div>
      )
    }

    if (type === 'triangles') {
      // 8 triangles in a square
      return (
        <div className="w-56 h-56 mx-auto bg-dark-bg/20 border-4 border-dark-bg rounded-2xl overflow-hidden p-2 shadow-inner">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {[
              "M 50 50 L 0 0 L 50 0 Z",       // Top left
              "M 50 50 L 50 0 L 100 0 Z",     // Top right
              "M 50 50 L 100 0 L 100 50 Z",   // Right top
              "M 50 50 L 100 50 L 100 100 Z", // Right bottom
              "M 50 50 L 100 100 L 50 100 Z", // Bottom right
              "M 50 50 L 50 100 L 0 100 Z",   // Bottom left
              "M 50 50 L 0 100 L 0 50 Z",     // Left bottom
              "M 50 50 L 0 50 L 0 0 Z"        // Left top
            ].map((d, i) => (
              <motion.path
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                d={d}
                fill={i < numerator ? '#ffcc00' : 'rgba(255,255,255,0.05)'}
                stroke="currentColor"
                strokeWidth="1"
                className="text-dark-bg"
              />
            ))}
          </svg>
        </div>
      )
    }

    return null
  }

  if (isSuperado) {
    return (
      <LevelCompletionModal 
        isOpen={true} 
        levelName="Dominio de Fracciones" 
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
                    <span className="text-xs font-black uppercase tracking-widest">Maestro de la Isla</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-6 leading-tight">
                    "Las fracciones son partes de un todo. Mira con atención las formas y elige la proporción correcta del hechizo."
                  </h2>

                  <button
                    onClick={() => setShowIntro(false)}
                    className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10">¡Aceptar el Desafío!</span>
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
                  <h1 className="text-3xl font-bold gradient-text">Visión de Fracciones</h1>
                  <p className="text-tertiary">Elige la fracción que representa la parte iluminada</p>
                </div>
                <div className="card !py-2 !px-4">
                  <p className="text-xs text-tertiary uppercase tracking-widest mb-1">Poder Acumulado</p>
                  <p className="text-2xl font-bold text-accent-yellow">{correctCount} <span className="text-sm text-secondary">/ 10</span></p>
                </div>
              </div>

              <motion.div 
                className="card min-h-[450px] flex flex-col items-center justify-center border-t-8 border-accent-yellow"
              >
                {problem && (
                  <div className="w-full text-center p-4">
                    {/* Visual Fraction */}
                    <div className="mb-12 flex items-center justify-center min-h-[240px]">
                      {renderVisual()}
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6">
                      {!problemClosed ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {problem.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleOptionClick(opt)}
                              className="group relative h-20 bg-dark-bg/40 border-4 border-white/5 rounded-2xl hover:border-accent-yellow hover:bg-dark-bg transition-all cursor-pointer overflow-hidden flex items-center justify-center"
                            >
                              <div className="text-3xl font-black italic text-primary dark:text-white group-hover:text-accent-yellow transition-colors flex flex-col items-center leading-none">
                                <span>{opt.split('/')[0]}</span>
                                <div className="w-10 h-1 bg-current opacity-20 my-1" />
                                <span>{opt.split('/')[1]}</span>
                              </div>
                              <div className="absolute inset-0 bg-accent-yellow/0 group-hover:bg-accent-yellow/5 transition-colors" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={generateProblem}
                          className="px-10 py-4 bg-gradient-to-r from-accent-yellow to-orange-400 text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all flex items-center gap-2 mx-auto cursor-pointer uppercase tracking-tighter"
                        >
                          <RefreshCw className="w-6 h-6" />
                          Siguiente Enigma
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
                              <><CheckCircle className="w-6 h-6" /> <span className="text-xl font-bold">¡Visión certera! La respuesta es {problem.numerator}/{problem.denominator}.</span></>
                            ) : (
                              <><XCircle className="w-6 h-6" /> <span className="text-xl font-bold">La magia ha fallado. ¡Inténtalo de nuevo, mago!</span></>
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
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Guía de Fracciones</h3>
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="p-6 bg-dark-bg/50 rounded-2xl border-2 border-white/5">
                      <h4 className="text-lg font-bold text-accent-yellow mb-2">¿Cómo identificar una fracción?</h4>
                      <p className="text-secondary dark:text-white/80 leading-relaxed mb-4">
                        1. **Cuenta el total** de partes iguales (este es el **denominador**, el número de abajo).
                        2. **Cuenta las partes coloreadas** (este es el **numerador**, el número de arriba).
                      </p>
                      
                      <div className="bg-dark-bg p-4 rounded-xl border border-white/10 font-mono text-center">
                        <div className="mb-2">Fracción = Partes Pintadas / Total de Partes</div>
                      </div>
                    </div>

                    <div className="p-6 bg-accent-yellow/10 rounded-2xl border-2 border-accent-yellow/20">
                      <h4 className="font-black text-accent-yellow uppercase text-sm mb-2">Formas Comunes</h4>
                      <ul className="text-sm text-secondary dark:text-white/70 space-y-2">
                        <li>• **Círculo**: Como una pizza cortada en porciones.</li>
                        <li>• **Cuadrícula**: Un tablero con casillas iluminadas.</li>
                        <li>• **Barra**: Una vara de poder dividida en segmentos.</li>
                      </ul>
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
