import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Sparkles, HelpCircle, X } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import WizardSprite from '../components/WizardSprite'
import LevelCompletionModal from '../components/LevelCompletionModal'
import { AnimatedGeometricFigure } from '../components/GeometricFigure'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

interface AdditionProblem {
  num1: number
  num2: number
  operator: '+' | '-'
  answer: number
  options: string[]
  figure1: 'circle' | 'triangle' | 'square'
  figure2: 'circle' | 'triangle' | 'square'
  color1: string
  color2: string
}

const FIGURE_TYPES: ('circle' | 'triangle' | 'square')[] = ['circle', 'triangle', 'square']

const FIGURE_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#95E1D3', // Mint
  '#F38181', // Pink
  '#AA96DA', // Purple
  '#FCBAD3', // Light Pink
  '#A8E6CF', // Light Green
]

export default function AdditionPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [problem, setProblem] = useState<AdditionProblem | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isSuperado, setIsSuperado] = useState(false)
  const [problemClosed, setProblemClosed] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const generateProblem = () => {
    const isAddition = Math.random() > 0.5
    const operator = isAddition ? '+' : '-'
    
    let n1, n2, ans
    if (isAddition) {
      n1 = Math.floor(Math.random() * 5) + 1
      n2 = Math.floor(Math.random() * 5) + 1
      ans = n1 + n2
    } else {
      n1 = Math.floor(Math.random() * 5) + 5
      n2 = Math.floor(Math.random() * 5) + 1
      ans = n1 - n2
    }

    const correctOption = ans.toString()
    
    // Generate distractors
    const distractors = new Set<string>()
    while (distractors.size < 3) {
      const dist = Math.max(0, ans + (Math.floor(Math.random() * 7) - 3)) // Random number around the answer
      const dStr = dist.toString()
      if (dStr !== correctOption) {
        distractors.add(dStr)
      }
    }

    const options = Array.from(distractors)
    options.push(correctOption)
    options.sort(() => Math.random() - 0.5)

    const figure1 = FIGURE_TYPES[Math.floor(Math.random() * FIGURE_TYPES.length)]
    const figure2 = figure1 // Use the same figure type for both operands
    const color1 = FIGURE_COLORS[Math.floor(Math.random() * FIGURE_COLORS.length)]
    const color2 = FIGURE_COLORS[Math.floor(Math.random() * FIGURE_COLORS.length)]

    setProblem({ num1: n1, num2: n2, operator, answer: ans, options, figure1, figure2, color1, color2 })
    setFeedback(null)
    setProblemClosed(false)
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const handleOptionClick = (option: string) => {
    if (!problem || problemClosed) return

    const optionValue = parseInt(option)

    if (optionValue === problem.answer) {
      setFeedback('correct')
      setProblemClosed(true)
      recordResult(5, true)
      
      const newCount = correctCount + 1
      setCorrectCount(newCount)
      
      if (newCount >= 10) {
        completeLevel('level1')
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
        levelName="Bosque de las Sumas y Restas" 
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
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-6 leading-tight">
                    "Bienvenido, tu primera mision sera superar los retos de sumas y restas, recuerda, que cada reto superado incrementará tu nivel de poder."
                  </h2>

                  <button
                    onClick={() => setShowIntro(false)}
                    className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10">¡Entendido, Maestro!</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </div>
              </div>
              
              {/* Decorative side bar */}
              <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent-yellow/50 to-transparent" />
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent-yellow/50 to-transparent" />
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Bosque de Sumas y Restas</h1>
            <p className="text-tertiary">Elige la expresión correcta para los objetos</p>
          </div>
          <div className="card !py-2 !px-4">
            <p className="text-xs text-tertiary uppercase tracking-widest mb-1">Progreso</p>
            <p className="text-2xl font-bold text-accent-yellow">{correctCount} <span className="text-sm text-secondary">/ 10</span></p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card min-h-[400px] flex flex-col items-center justify-center border-t-8 border-accent-yellow"
        >
          {problem && (
            <div className="w-full text-center">
              {/* Visual Items */}
              <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
                <div className="flex flex-wrap max-w-[200px] justify-center gap-2">
                  {Array.from({ length: problem.num1 }).map((_, i) => (
                    <AnimatedGeometricFigure
                      key={`n1-${i}`}
                      type={problem.figure1}
                      size={48}
                      color={problem.color1}
                      className="filter drop-shadow-lg"
                    />
                  ))}
                </div>

                <div className="text-6xl font-bold text-accent-yellow">
                  {problem.operator}
                </div>

                <div className="flex flex-wrap max-w-[200px] justify-center gap-2">
                  {Array.from({ length: problem.num2 }).map((_, i) => (
                    <AnimatedGeometricFigure
                      key={`n2-${i}`}
                      type={problem.figure2}
                      size={48}
                      color={problem.color2}
                      className="filter drop-shadow-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {problem.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    disabled={problemClosed}
                    className="group relative h-20 bg-dark-bg border-2 border-border-color cursor-pointer rounded-2xl hover:border-accent-yellow hover:bg-dark-bg/80 transition-all overflow-hidden"
                  >
                    <span className="text-2xl font-mono text-primary dark:text-white group-hover:text-accent-yellow transition-colors italic">
                      {opt}
                    </span>
                  </button>
                ))}
              </div>

              {/* Feedback */}
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
                      <><CheckCircle className="w-5 h-5" /> <span>¡Excelente! Eres un genio.</span></>
                    ) : (
                      <><XCircle className="w-5 h-5" /> <span>¡Uy! Intenta con otra opción.</span></>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {problemClosed && feedback === 'correct' && (
                <button
                  onClick={generateProblem}
                  className="mt-8 px-8 py-3 bg-gradient-to-r cursor-pointer from-accent-yellow to-gradient-to text-dark-bg font-bold rounded-xl hover:shadow-glow transition-smooth flex items-center gap-2 mx-auto"
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
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Guía de Sumas y Restas</h3>
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="p-6 bg-dark-bg/50 rounded-2xl border-2 border-white/5">
                      <h4 className="text-lg font-bold text-accent-yellow mb-2">Sumas (+)</h4>
                      <p className="text-secondary dark:text-white/80 leading-relaxed mb-4">
                        Sumar es unir o juntar varios grupos de objetos. Si tienes 3 manzanas y te dan 2 más, ahora tienes un grupo más grande de 5.
                      </p>
                      
                      <h4 className="text-lg font-bold text-accent-yellow mb-2">Restas (-)</h4>
                      <p className="text-secondary dark:text-white/80 leading-relaxed">
                        Restar es quitar o separar una cantidad de un grupo. Si tienes 5 caramelos y te comes 2, ahora tienes un grupo más pequeño de 3.
                      </p>
                    </div>

                    <div className="p-6 bg-accent-yellow/10 rounded-2xl border-2 border-accent-yellow/20">
                      <h4 className="font-black text-accent-yellow uppercase text-sm mb-2">Truco del Mago</h4>
                      <p className="text-sm text-secondary dark:text-white/70 italic">
                        "¡Cuenta los objetos uno a uno con tu dedo! En el Bosque, los objetos te dirán la respuesta si los observas con atención."
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
