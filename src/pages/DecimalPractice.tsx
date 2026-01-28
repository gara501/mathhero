import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import WizardSprite from '../components/WizardSprite'
import LevelCompletionModal from '../components/LevelCompletionModal'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

interface DecimalProblem {
  fullNumber: string
  highlightedIndex: number
  digit: string
  correctPosition: string
  options: string[]
}

const POSITIONS = [
  { key: 'thousands', label: 'Millares', offset: -4 },
  { key: 'hundreds', label: 'Centenas', offset: -3 },
  { key: 'tens', label: 'Decenas', offset: -2 },
  { key: 'units', label: 'Unidades', offset: -1 },
  { key: 'tenths', label: 'Décimas', offset: 1 },
  { key: 'hundredths', label: 'Centésimas', offset: 2 },
  { key: 'thousandths', label: 'Milésimas', offset: 3 },
  { key: 'tenthousandths', label: 'Diezmilésimas', offset: 4 },
]

export default function DecimalPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [problem, setProblem] = useState<DecimalProblem | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isSuperado, setIsSuperado] = useState(false)
  const [problemClosed, setProblemClosed] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  const generateProblem = () => {
    // Generate a number like XXXX.XXXX
    const beforeDecCount = Math.floor(Math.random() * 4) + 1 // 1 to 4
    const afterDecCount = Math.floor(Math.random() * 4) + 1 // 1 to 4
    
    let before = ''
    for (let i = 0; i < beforeDecCount; i++) {
        before += Math.floor(Math.random() * 10).toString()
    }
    // Remove leading zeros if more than 1 digit
    if (before.length > 1 && before[0] === '0') {
        before = (Math.floor(Math.random() * 9) + 1).toString() + before.slice(1)
    } else if (before === '') {
        before = '0'
    }

    let after = ''
    for (let i = 0; i < afterDecCount; i++) {
        after += Math.floor(Math.random() * 10).toString()
    }

    const fullNumber = `${before}.${after}`
    const dpIndex = before.length
    
    // Pick a random digit index (excluding the dot)
    let highlightIdx
    do {
        highlightIdx = Math.floor(Math.random() * fullNumber.length)
    } while (fullNumber[highlightIdx] === '.')

    const digit = fullNumber[highlightIdx]
    const relativeOffset = highlightIdx - dpIndex
    
    // Find correct position label
    const pos = POSITIONS.find(p => p.offset === relativeOffset)
    const correctPosition = pos ? pos.label : 'Unidades' // Fallback

    // Options: Choose 4 labels including the correct one
    const availableLabels = POSITIONS.map(p => p.label)
    const options = [correctPosition]
    while (options.length < 4) {
        const randLabel = availableLabels[Math.floor(Math.random() * availableLabels.length)]
        if (!options.includes(randLabel)) {
            options.push(randLabel)
        }
    }
    options.sort(() => Math.random() - 0.5)

    setProblem({ fullNumber, highlightedIndex: highlightIdx, digit, correctPosition, options })
    setFeedback(null)
    setProblemClosed(false)
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const handleOptionClick = (option: string) => {
    if (!problem || problemClosed) return

    if (option === problem.correctPosition) {
      setFeedback('correct')
      setProblemClosed(true)
      recordResult(5, true)
      
      const newCount = correctCount + 1
      setCorrectCount(newCount)
      
      if (newCount >= 10) {
        completeLevel('level5')
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
        levelName="Reto de Decimales" 
        points={correctCount * 5} 
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
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-text-secondary dark:text-text-secondary hover:dark:text-white cursor-pointer hover:text-primary mb-8 transition-colors"
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
                    <span className="text-xs font-black uppercase tracking-widest">Maestro Decimal</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white mb-6 leading-tight">
                    "Para dominar los grandes números, primero debes entender el valor de cada pequeña parte. ¿Podrás identificar la posición de los decimales?"
                  </h2>

                  <button
                    onClick={() => setShowIntro(false)}
                    className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10">¡Estoy listo!</span>
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
                  <h1 className="text-3xl font-bold gradient-text">Reto de Decimales</h1>
                  <p className="text-text-tertiary">Identifica el valor posicional del dígito resaltado</p>
                </div>
                <div className="card !py-2 !px-4">
                  <p className="text-xs text-text-tertiary uppercase tracking-widest mb-1">Progreso</p>
                  <p className="text-2xl font-bold text-accent-yellow">{correctCount} <span className="text-sm text-text-secondary">/ 10</span></p>
                </div>
              </div>

              <motion.div 
                className="card min-h-[400px] flex flex-col items-center justify-center border-t-8 border-accent-yellow"
              >
                {problem && (
                  <div className="w-full text-center p-4">
                    <div className="mb-12">
                      <p className="text-xl text-text-tertiary mb-4 italic">¿En qué posición está el número <span className="text-accent-yellow font-black text-2xl">{problem.digit}</span>?</p>
                      <div className="text-6xl md:text-8xl font-black tracking-normal flex justify-center items-center gap-1 font-mono">
                        {problem.fullNumber.split('').map((char, idx) => (
                          <span 
                            key={idx}
                            className={idx === problem.highlightedIndex ? 'text-accent-yellow drop-shadow-[0_0_15px_rgba(244,224,77,0.5)] scale-110 inline-block transition-transform' : 'text-text-primary dark:text-white opacity-40'}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {problem.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(opt)}
                          disabled={problemClosed}
                          className={`
                            group relative h-20 border-2 rounded-2xl transition-all overflow-hidden cursor-pointer
                            ${problemClosed && opt === problem.correctPosition 
                              ? 'border-green-500 bg-green-500/10' 
                              : problemClosed && feedback === 'incorrect' && opt !== problem.correctPosition
                                ? 'border-border-color opacity-50'
                                : 'border-border-color bg-dark-bg hover:border-accent-yellow hover:bg-dark-bg/80'}
                          `}
                        >
                          <span className={`text-xl font-bold group-hover:text-accent-yellow transition-colors uppercase tracking-widest
                            ${problemClosed && opt === problem.correctPosition ? 'text-green-500' : 'text-text-primary dark:text-white'}
                          `}>
                            {opt}
                          </span>
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`mt-8 p-4 rounded-xl flex items-center justify-center gap-2 ${
                            feedback === 'correct' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {feedback === 'correct' ? (
                            <><CheckCircle className="w-5 h-5" /> <span>¡Excelente! Has identificado la posición correctamente.</span></>
                          ) : (
                            <><XCircle className="w-5 h-5" /> <span>¡Incorrecto! Observa bien los lugares después del punto.</span></>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {problemClosed && feedback === 'correct' && (
                      <button
                        onClick={generateProblem}
                        className="mt-8 px-8 py-3 bg-gradient-to-r from-accent-yellow to-orange-400 text-dark-bg font-black rounded-xl hover:shadow-glow transition-smooth flex items-center gap-2 mx-auto uppercase tracking-tighter cursor-pointer"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Siguiente Desafío
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
