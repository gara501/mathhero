import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, Eye, CheckCircle, XCircle, Sparkles, BookOpen, HelpCircle, X } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import WizardSprite from '../components/WizardSprite'
import LevelCompletionModal from '../components/LevelCompletionModal'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

interface FunctionProblem {
  sequence: number[]
  missingIndex: number
  answer: number
  functionName: string
  formula: string
}

const MATHEMATICAL_FUNCTIONS = [
  { 
    name: 'Cuadrática', 
    formula: 'f(n) = n²', 
    description: 'El número se multiplica por sí mismo: 1, 4, 9, 16...',
    fn: (n: number) => Math.pow(n, 2) 
  },
  { 
    name: 'Cúbica', 
    formula: 'f(n) = n³', 
    description: 'El número se multiplica tres veces por sí mismo: 1, 8, 27...',
    fn: (n: number) => Math.pow(n, 3) 
  },
  { 
    name: 'Potencia de 2', 
    formula: 'f(n) = 2ⁿ', 
    description: 'Duplicación mágica: 2, 4, 8, 16, 32...',
    fn: (n: number) => Math.pow(2, n) 
  },
  { 
    name: 'Sucesión de Pronicos', 
    formula: 'f(n) = n(n+1)', 
    description: 'Multiplicar n por su siguiente: 2 (1x2), 6 (2x3), 12 (3x4)...',
    fn: (n: number) => n * (n + 1) 
  },
  { 
    name: 'Cuadrática + 1', 
    formula: 'f(n) = n² + 1', 
    description: 'El cuadrado más uno: 2, 5, 10, 17...',
    fn: (n: number) => Math.pow(n, 2) + 1 
  },
  { 
    name: 'Triangulares', 
    formula: 'f(n) = n(n+1)/2', 
    description: 'Suma de naturales: 1, 3, 6, 10, 15...',
    fn: (n: number) => (n * (n + 1)) / 2 
  },
]

export default function FunctionPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [problem, setProblem] = useState<FunctionProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isSuperado, setIsSuperado] = useState(false)
  const [problemClosed, setProblemClosed] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const generateProblem = () => {
    const selectedFn = MATHEMATICAL_FUNCTIONS[Math.floor(Math.random() * MATHEMATICAL_FUNCTIONS.length)]
    const offset = Math.floor(Math.random() * 3) + 1
    const sequenceLength = 5

    const sequence = Array.from(
      { length: sequenceLength },
      (_, i) => selectedFn.fn(i + offset)
    )

    const missingIndex = Math.floor(Math.random() * (sequenceLength - 1)) + 1
    const answer = sequence[missingIndex]

    setProblem({
      sequence,
      missingIndex,
      answer,
      functionName: selectedFn.name,
      formula: selectedFn.formula,
    })

    setUserAnswer('')
    setFeedback(null)
    setProblemClosed(false)
    setShowAnswer(false)
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const checkAnswer = () => {
    if (!problem || problemClosed) return

    const userNum = parseInt(userAnswer)
    if (userNum === problem.answer) {
      setFeedback('correct')
      setProblemClosed(true)
      recordResult(25, true)
      
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
        levelName="Maestro de Funciones" 
        points={correctCount * 25} 
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
            onClick={() => navigate('/dashboard')}
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
                    <span className="text-xs font-black uppercase tracking-widest">Maestro de Funciones</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-6 leading-tight">
                    "Las funciones son el lenguaje del universo. Cada número sigue una regla secreta... ¿Podrás descifrarla?"
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button
                      onClick={() => setShowIntro(false)}
                      className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter overflow-hidden cursor-pointer"
                    >
                      <span className="relative z-10">¡Aceptar el Reto!</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>

                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-dark-bg/40 text-accent-yellow border-2 border-accent-yellow/20 rounded-2xl hover:bg-dark-bg/60 transition-all cursor-pointer font-bold"
                    >
                      <BookOpen className="w-5 h-5" />
                      {showExplanation ? 'Ocultar Saber' : 'Aprender Más'}
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-dark-bg/20"
                  >
                    <div className="p-8 border-t-2 border-accent-yellow/10">
                      <h4 className="text-xl font-bold text-accent-yellow mb-4">¿Qué estamos buscando?</h4>
                      <p className="text-secondary dark:text-white/80 leading-relaxed">
                        En este nivel, los números no crecen de forma simple (como +2 o +5). Aquí siguen una <strong>función matemática</strong>. 
                        Por ejemplo, en la secuencia 1, 4, 9, 16... cada número es la posición al cuadrado (1², 2², 3², 4²). 
                        Tu misión es encontrar la regla y completar el término que falta.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Maestro de Funciones</h1>
                  <p className="text-tertiary dark:text-white/60">Descifra la regla de la secuencia</p>
                </div>
                <div className="card !py-2 !px-4">
                  <p className="text-xs text-tertiary dark:text-white/40 uppercase tracking-widest mb-1">Poder Acumulado</p>
                  <p className="text-2xl font-bold text-accent-yellow">{correctCount} <span className="text-sm text-secondary">/ 10</span></p>
                </div>
              </div>

              <motion.div 
                className="card min-h-[400px] flex flex-col items-center justify-center border-t-8 border-accent-yellow"
              >
                {problem && (
                  <div className="w-full text-center p-4">
                    <div className="mb-12">
                      <p className="text-xl text-tertiary dark:text-white/60 mb-8 italic">¿Qué número completa el patrón mágico?</p>
                      
                      <div className="flex flex-wrap justify-center gap-4">
                        {problem.sequence.map((num, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`
                              w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black border-2
                              ${idx === problem.missingIndex 
                                ? 'bg-accent-yellow/10 border-accent-yellow text-accent-yellow shadow-glow-yellow' 
                                : 'bg-dark-bg border-white/5 text-primary dark:text-white opacity-80'}
                            `}
                          >
                            {idx === problem.missingIndex ? '?' : num}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="max-w-md mx-auto space-y-6">
                      {!problemClosed ? (
                        <>
                          <div className="relative">
                            <input
                              type="number"
                              value={userAnswer}
                              onChange={(e) => {
                              setUserAnswer(e.target.value)
                              if (feedback === 'incorrect') setFeedback(null)
                            }}
                              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                              placeholder="Tu respuesta..."
                              className="w-full h-16 bg-dark-bg border-4 border-white/10 rounded-2xl px-6 text-2xl font-bold text-center focus:border-accent-yellow outline-none transition-all dark:text-white"
                              autoFocus
                            />
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={checkAnswer}
                              disabled={!userAnswer}
                              className="flex-1 h-14 bg-accent-yellow text-dark-bg font-black rounded-xl hover:shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-tighter"
                            >
                              Lanzar Hechizo
                            </button>
                            <button
                              onClick={() => setShowAnswer(true)}
                              className="px-6 h-14 bg-white/5 text-tertiary dark:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6">
                          <div className="card bg-accent-yellow/5 border-accent-yellow/20">
                            <p className="text-sm text-accent-yellow uppercase font-black tracking-widest mb-1">Regla Revelada</p>
                            <p className="text-2xl font-bold text-primary dark:text-white">{problem.functionName}: {problem.formula}</p>
                          </div>

                          <button
                            onClick={generateProblem}
                            className="px-10 py-4 bg-gradient-to-r from-accent-yellow to-orange-400 text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all flex items-center gap-2 mx-auto cursor-pointer uppercase tracking-tighter"
                          >
                            <RefreshCw className="w-6 h-6" />
                            Siguiente Enigma
                          </button>
                        </div>
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
                              <><CheckCircle className="w-6 h-6" /> <span className="text-xl font-bold">¡Sabiduría absoluta! has descifrado la regla.</span></>
                            ) : (
                              <><XCircle className="w-6 h-6" /> <span className="text-xl font-bold">La magia ha fallado. Revisa tu cálculo e intenta de nuevo.</span></>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <AnimatePresence>
                      {showAnswer && !problemClosed && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mt-6 p-4 bg-dark-bg/60 border-2 border-accent-yellow/40 rounded-xl text-accent-yellow font-bold italic"
                        >
                          "Psst... El número oculto es {problem.answer}... Pero no se lo digas a nadie."
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Guía del Maestro</h3>
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="p-6 bg-dark-bg/50 rounded-2xl border-2 border-white/5">
                      <p className="text-secondary dark:text-white/80 leading-relaxed mb-4">
                        Cada secuencia sigue una de estas reglas mágicas. Observa cómo cambian los números para identificar cuál se está aplicando:
                      </p>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {MATHEMATICAL_FUNCTIONS.map((fn, idx) => (
                          <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-accent-yellow/30 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-accent-yellow">{fn.name}</span>
                              <code className="text-xs bg-dark-bg px-2 py-1 rounded text-orange-400">{fn.formula}</code>
                            </div>
                            <p className="text-xs text-tertiary dark:text-white/40">{fn.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-accent-yellow/10 rounded-2xl border-2 border-accent-yellow/20">
                      <h4 className="font-black text-accent-yellow uppercase text-sm mb-2">Consejo del Mago</h4>
                      <p className="text-sm text-secondary dark:text-white/70 italic">
                        "Si notas que los números crecen muy rápido, busca una regla cuadrática o cúbica. Si crecen duplicándose, estás ante una potencia de 2."
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
