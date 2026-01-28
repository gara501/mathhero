import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Eye, CheckCircle, XCircle } from 'lucide-react'
import { useUserStore } from '../store/userStore'

interface FunctionProblem {
  sequence: number[]
  missingIndex: number
  answer: number
  functionName: string
  formula: string
}

const MATHEMATICAL_FUNCTIONS = [
  { name: 'Cuadrática', formula: 'f(n) = n²', fn: (n: number) => Math.pow(n, 2) },
  { name: 'Cúbica', formula: 'f(n) = n³', fn: (n: number) => Math.pow(n, 3) },
  { name: 'Potencia de 2', formula: 'f(n) = 2ⁿ', fn: (n: number) => Math.pow(2, n) },
  { name: 'Sucesión de Pronicos', formula: 'f(n) = n(n+1)', fn: (n: number) => n * (n + 1) },
  { name: 'Cuadrática + 1', formula: 'f(n) = n² + 1', fn: (n: number) => Math.pow(n, 2) + 1 },
  { name: 'Triangulares', formula: 'f(n) = n(n+1)/2', fn: (n: number) => (n * (n + 1)) / 2 },
]

export default function FunctionPractice() {
  const navigate = useNavigate()
  const { recordResult, stats } = useUserStore()
  const [problem, setProblem] = useState<FunctionProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [score, setScore] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [problemClosed, setProblemClosed] = useState(false)

  const generateProblem = () => {
    // Select a random function
    const selectedFn = MATHEMATICAL_FUNCTIONS[Math.floor(Math.random() * MATHEMATICAL_FUNCTIONS.length)]
    
    // Choose a starting offset (n starting from something small)
    const offset = Math.floor(Math.random() * 3) + 1
    const sequenceLength = 5

    const sequence = Array.from(
      { length: sequenceLength },
      (_, i) => selectedFn.fn(i + offset)
    )

    // Randomly choose which term to hide (avoiding first term for clarity)
    const missingIndex = Math.floor(Math.random() * (sequenceLength - 1)) + 1
    const answer = sequence[missingIndex]

    setProblem({
      sequence,
      missingIndex,
      answer,
      functionName: selectedFn.name,
      formula: selectedFn.formula,
    })

    // Reset state
    setUserAnswer('')
    setAttempts(0)
    setScore(0)
    setShowAnswer(false)
    setFeedback(null)
    setProblemClosed(false)
  }

  const checkAnswer = () => {
    if (!problem || problemClosed) return

    const userNum = parseInt(userAnswer)
    if (isNaN(userNum)) {
      setFeedback('incorrect')
      return
    }

    if (userNum === problem.answer) {
      // Correct answer - calculate points
      const points = attempts === 0 ? 25 : attempts === 1 ? 20 : attempts === 2 ? 15 : 10
      setScore(points)
      recordResult(points, true)
      setFeedback('correct')
      setProblemClosed(true)
    } else {
      // Incorrect answer
      setAttempts(prev => prev + 1)
      recordResult(0, false)
      setFeedback('incorrect')
    }
  }

  const revealAnswer = () => {
    setShowAnswer(true)
    setScore(0)
    setProblemClosed(true)
    setFeedback(null)
  }

  const getPointsForAttempt = () => {
    if (attempts === 0) return 25 // Function-based is hardest
    if (attempts === 1) return 20
    if (attempts === 2) return 15
    return 10
  }

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 relative">
      {/* Background Image with Alpha */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        style={{ backgroundImage: 'url(mathbg.png)' }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-text-secondary dark:text-text-secondary hover:cursor-pointer dark:hover:text-text-tertiary hover:text-text-primary transition-smooth mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>

          <h1 className="text-4xl font-bold gradient-text mb-4">Series con Funciones</h1>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold text-text-primary dark:text-text-tertiary mb-3">
              ¿Qué son las Series con Funciones?
            </h2>
            <p className="text-text-secondary dark:text-text-tertiary leading-relaxed">
              Son sucesiones donde cada término se calcula aplicando una función específica a su posición (n). 
              A diferencia de las aritméticas o geométricas, estas pueden crecer de forma cuadrática, cúbica o exponencial.
            </p>
          </div>

          {/* Score Display */}
          <div className="flex items-center justify-between mb-6">
            <div className="card flex items-center gap-4">
              <div>
                <p className="text-sm text-text-secondary">Puntuación Total</p>
                <p className="text-3xl font-bold text-accent-yellow">{stats.totalPoints}</p>
              </div>
            </div>

            {!problemClosed && problem && (
              <div className="card">
                <p className="text-sm text-text-secondary mb-1">Puntos por respuesta correcta</p>
                <p className="text-2xl font-bold text-text-primary dark:text-text-tertiary">{getPointsForAttempt()}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Problem Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
        >
          {!problem ? (
            <div className="text-center py-12">
              <p className="text-text-secondary dark:text-text-tertiary mb-6">
                Haz clic en "Generar Nuevo Reto" para comenzar
              </p>
              <button
                onClick={generateProblem}
                className="px-6 py-3 bg-gradient-to-r from-accent-yellow to-gradient-to text-text-secondary dark:text-dark cursor-pointer font-semibold rounded-xl hover:shadow-glow transition-smooth flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-5 h-5" />
                Generar Nuevo Reto
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary dark:text-text-tertiary">
                  Encuentra el patrón y el término faltante
                </h3>
                <span className="text-sm text-text-secondary dark:text-text-tertiary">Intento {attempts + 1}</span>
              </div>

              {/* Sequence Display */}
              <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
                {problem.sequence.map((num, index) => (
                  <div
                    key={index}
                    className={`
                      px-6 h-16 rounded-xl flex items-center justify-center text-xl font-bold min-w-[4rem]
                      ${
                        index === problem.missingIndex
                          ? 'bg-accent-yellow/20 border-2 border-accent-yellow text-accent-yellow dark:border-accent-yellow/50 dark:text-accent-yellow/50'
                          : 'bg-dark-card text-text-primary dark:text-text-tertiary border border-border-color'
                      }
                    `}
                  >
                    {index === problem.missingIndex ? '?' : num}
                  </div>
                ))}
              </div>

              {/* Answer Input */}
              {!problemClosed && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-secondary dark:text-text-tertiary mb-2">
                    Tu respuesta:
                  </label>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && checkAnswer()}
                    className="w-full px-4 py-3 bg-dark-card border border-border-color rounded-xl text-text-primary dark:text-text-tertiary focus:outline-none focus:border-accent-yellow transition-smooth"
                    placeholder="Ingresa el número faltante"
                    autoFocus
                  />
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    flex items-center gap-2 p-4 rounded-xl mb-6
                    ${
                      feedback === 'correct'
                        ? 'bg-green-500/20 text-green-500 dark:border-green-500/50 border border-green-500/50'
                        : 'bg-red-500/20 text-red-500 dark:border-red-500/50 border border-red-500/50'
                    }
                  `}
                >
                  {feedback === 'correct' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">¡Correcto! +{score} puntos</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">Incorrecto. Analiza cómo crecen los números.</span>
                    </>
                  )}
                </motion.div>
              )}

              {/* Show Answer */}
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent-yellow/20 border border-accent-yellow dark:border-accent-yellow/50 rounded-xl p-4 mb-6"
                >
                  <p className="text-text-primary dark:text-text-tertiary font-semibold mb-2">
                    Respuesta: {problem.answer}
                  </p>
                  <p className="text-sm text-text-secondary dark:text-text-tertiary uppercase tracking-wider font-bold">
                    Función: {problem.functionName} ({problem.formula})
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!problemClosed && (
                  <>
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-yellow to-gradient-to text-text-secondary dark:text-dark cursor-pointer font-semibold rounded-xl hover:shadow-glow transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verificar Respuesta
                    </button>
                    <button
                      onClick={revealAnswer}
                      className="px-6 py-3 bg-dark-card cursor-pointer border border-border-color text-text-secondary dark:text-text-tertiary font-semibold rounded-xl hover:bg-dark-card-hover transition-smooth flex items-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      Ver Respuesta
                    </button>
                  </>
                )}

                {problemClosed && (
                  <button
                    onClick={generateProblem}
                    className="w-full px-6 py-3 bg-gradient-to-r from-accent-yellow to-gradient-to text-text-secondary dark:text-dark cursor-pointer font-semibold rounded-xl hover:shadow-glow transition-smooth flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Generar Nuevo Reto
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
