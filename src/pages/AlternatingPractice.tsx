import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, Eye, CheckCircle, XCircle, Sparkles, BookOpen, HelpCircle, X } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import WizardSprite from '../components/WizardSprite'
import LevelCompletionModal from '../components/LevelCompletionModal'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

interface AlternatingProblem {
  sequence: number[]
  missingIndex: number
  answer: number
  firstTerm: number
  difference1: number
  difference2: number
}

export default function AlternatingPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [problem, setProblem] = useState<AlternatingProblem | null>(null)
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
    const firstTerm = Math.floor(Math.random() * 50) + 10
    const difference1 = Math.floor(Math.random() * 10) + 2
    const difference2 = -(Math.floor(Math.random() * 8) + 1)
    const sequenceLength = 7

    const sequence: number[] = [firstTerm]
    for (let i = 1; i < sequenceLength; i++) {
      const diff = i % 2 !== 0 ? difference1 : difference2
      sequence.push(sequence[i - 1] + diff)
    }

    const missingIndex = Math.floor(Math.random() * (sequenceLength - 2)) + 1
    const answer = sequence[missingIndex]

    setProblem({
      sequence,
      missingIndex,
      answer,
      firstTerm,
      difference1,
      difference2,
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
        completeLevel('level8')
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
        levelName="Reto Alternado" 
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
            className="flex items-center gap-2 text-text-secondary dark:text-text-secondary hover:dark:text-white cursor-pointer hover:text-primary transition-colors"
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
                    <span className="text-xs font-black uppercase tracking-widest">Maestro de Series</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white mb-6 leading-tight">
                    "Las series alternadas son un baile de números: suben y bajan con elegancia. ¿Podrás seguirles el ritmo?"
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button
                      onClick={() => setShowIntro(false)}
                      className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter overflow-hidden cursor-pointer"
                    >
                      <span className="relative z-10">¡Empezar Baile!</span>
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
                      <h4 className="text-xl font-bold text-accent-yellow mb-4">¿Qué es una Serie Alternada?</h4>
                      <p className="text-text-secondary dark:text-white/80 leading-relaxed">
                        Es una secuencia donde el cambio entre números varía. Por ejemplo, primero sumas 5 y luego restas 2. 
                        5, 10, 8, 13, 11, 16... (aquí el patrón es +5, -2, +5, -2...).
                        ¡Usa tu visión de mago para detectar ambos saltos!
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
                  <h1 className="text-3xl font-bold gradient-text">Series Alternas</h1>
                  <p className="text-text-tertiary dark:text-white/60">Descifra el doble patrón para encontrar el número faltante</p>
                </div>
                <div className="card !py-2 !px-4">
                  <p className="text-xs text-text-tertiary dark:text-white/40 uppercase tracking-widest mb-1">Poder Acumulado</p>
                  <p className="text-2xl font-bold text-accent-yellow">{correctCount} <span className="text-sm text-text-secondary">/ 10</span></p>
                </div>
              </div>

              <motion.div 
                className="card min-h-[400px] flex flex-col items-center justify-center border-t-8 border-accent-yellow"
              >
                {problem && (
                  <div className="w-full text-center p-4">
                    <div className="mb-12">
                      <p className="text-xl text-text-tertiary dark:text-white/60 mb-8 italic">¿Qué número sigue el ritmo de este baile?</p>
                      
                      <div className="flex flex-wrap justify-center gap-4">
                        {problem.sequence.map((num, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`
                              w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black border-2
                              ${idx === problem.missingIndex 
                                ? 'bg-accent-yellow/10 border-accent-yellow text-accent-yellow shadow-glow-yellow' 
                                : 'bg-dark-bg border-white/5 text-text-primary dark:text-white opacity-80'}
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
                              className="px-6 h-14 bg-white/5 text-text-tertiary dark:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6">
                          <div className="card bg-accent-yellow/5 border-accent-yellow/20">
                            <p className="text-sm text-accent-yellow uppercase font-black tracking-widest mb-1">Secreto del Doble Patrón</p>
                            <p className="text-xl font-bold text-text-primary dark:text-white">
                              Paso 1: {problem.difference1 > 0 ? '+' : ''}{problem.difference1} | Paso 2: {problem.difference2 > 0 ? '+' : ''}{problem.difference2}
                            </p>
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
                              <><CheckCircle className="w-6 h-6" /> <span className="text-xl font-bold">¡Sabiduría absoluta! has descifrado el baile.</span></>
                            ) : (
                              <><XCircle className="w-6 h-6" /> <span className="text-xl font-bold">La magia ha fallado. ¡No te rindas y vuelve a intentar!</span></>
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
                  className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-tertiary hover:text-white transition-colors cursor-pointer z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                  <div className="flex items-center gap-3 text-accent-yellow mb-6">
                    <HelpCircle className="w-8 h-8" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Guía Alternada</h3>
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="p-6 bg-dark-bg/50 rounded-2xl border-2 border-white/5">
                      <h4 className="text-lg font-bold text-accent-yellow mb-2">El Doble Ritmo</h4>
                      <p className="text-text-secondary dark:text-white/80 leading-relaxed mb-4">
                        En estas series, el salto no es siempre el mismo. Va cambiando entre dos valores de forma alternada.
                      </p>
                      <div className="bg-dark-bg p-4 rounded-xl border border-white/10 font-mono text-center">
                        <span className="text-accent-yellow">10 (+5) 15 (-2) 13 (+5) 18 (-2) 16...</span>
                      </div>
                    </div>

                    <div className="p-6 bg-accent-yellow/10 rounded-2xl border-2 border-accent-yellow/20">
                      <h4 className="font-black text-accent-yellow uppercase text-sm mb-2">Truco del Mago</h4>
                      <p className="text-sm text-text-secondary dark:text-white/70 italic">
                        "¡Observa los tres primeros números! Resta el 2º menos el 1º, y luego el 3º menos el 2º. Ahí verás los dos saltos del baile."
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
