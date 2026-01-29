import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Sparkles, HelpCircle, X, GripHorizontal } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import WizardSprite from '../components/WizardSprite'
import LevelCompletionModal from '../components/LevelCompletionModal'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

interface SortingProblem {
  id: string
  numbers: number[]
  correctOrder: number[]
}

export default function DecimalSortingPractice() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  
  const [problem, setProblem] = useState<SortingProblem | null>(null)
  const [items, setItems] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isSuperado, setIsSuperado] = useState(false)
  const [problemClosed, setProblemClosed] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const generateProblem = () => {
    const count = Math.floor(Math.random() * 2) + 3 // 3 or 4 numbers
    const newNumbers: number[] = []
    
    // Mix of difficulties
    const base = Math.floor(Math.random() * 20)
    for (let i = 0; i < count; i++) {
      let num: number
      do {
        // Shared integer part sometimes to make it harder
        const sameBase = Math.random() > 0.4
        const integerPart = sameBase ? base : Math.floor(Math.random() * 20)
        const decimalPart = Math.floor(Math.random() * 100) / 100
        num = parseFloat((integerPart + decimalPart).toFixed(2))
      } while (newNumbers.includes(num))
      newNumbers.push(num)
    }

    const sortedOrder = [...newNumbers].sort((a, b) => a - b)
    
    setProblem({ 
      id: Date.now().toString(),
      numbers: newNumbers,
      correctOrder: sortedOrder
    })
    // Shuffle items for the UI
    setItems([...newNumbers].sort(() => Math.random() - 0.5))
    setFeedback(null)
    setProblemClosed(false)
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const checkResults = () => {
    if (!problem || problemClosed) return

    const isCorrect = items.every((num, idx) => num === problem.correctOrder[idx])

    if (isCorrect) {
      setFeedback('correct')
      setProblemClosed(true)
      recordResult(15, true)
      
      const newCount = correctCount + 1
      setCorrectCount(newCount)
      
      if (newCount >= 10) {
        completeLevel('level6')
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
        levelName="Ordenamiento Decimal" 
        points={correctCount * 15} 
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
                    <span className="text-xs font-black uppercase tracking-widest">Misión de Reordenamiento</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white mb-6 leading-tight">
                    "Los cristales decimales se han desordenado. Debes organizarlos de menor a mayor para restaurar el flujo de la magia."
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
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Ordenamiento Decimal</h1>
                  <p className="text-text-tertiary">Arrastra los números para ordenarlos de menor a mayor</p>
                </div>
                <div className="card !py-2 !px-4">
                  <p className="text-xs text-text-tertiary uppercase tracking-widest mb-1">Pasos Correctos</p>
                  <p className="text-2xl font-bold text-accent-yellow">{correctCount} <span className="text-sm text-text-secondary">/ 10</span></p>
                </div>
              </div>

              <motion.div 
                className="card min-h-[450px] flex flex-col items-center justify-center border-t-8 border-accent-yellow"
              >
                {problem && (
                  <div className="w-full text-center p-4">
                    <div className="mb-12">
                      <p className="text-xl text-text-tertiary dark:text-white/60 mb-8 italic">Organiza estos cristales de poder:</p>
                      
                      <Reorder.Group 
                        axis="x" 
                        values={items} 
                        onReorder={setItems}
                        className="flex flex-wrap justify-center gap-4 py-8"
                      >
                        {items.map((num) => (
                          <Reorder.Item
                            key={num}
                            value={num}
                            drag={!problemClosed ? "x" : false}
                            className={`
                              cursor-grab active:cursor-grabbing select-none
                              w-28 h-20 md:w-32 md:h-24 rounded-2xl flex flex-col items-center justify-center text-2xl md:text-3xl font-black border-4 shadow-xl transition-colors
                              ${problemClosed 
                                ? 'bg-green-500/10 border-green-500/50 text-green-500' 
                                : 'bg-dark-bg border-white/10 text-white hover:border-accent-yellow'}
                            `}
                          >
                            <GripHorizontal className="w-4 h-4 mb-2 opacity-20" />
                            <span>{num.toString().replace('.', ',')}</span>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>

                    <div className="max-w-md mx-auto space-y-6">
                      {!problemClosed ? (
                        <button
                          onClick={checkResults}
                          className="w-full h-16 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all active:scale-95 cursor-pointer uppercase tracking-tighter"
                        >
                          Hechizo de Validación
                        </button>
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
                              <><CheckCircle className="w-6 h-6" /> <span className="text-xl font-bold">¡El orden es perfecto! La magia fluye de nuevo.</span></>
                            ) : (
                              <><XCircle className="w-6 h-6" /> <span className="text-xl font-bold">Un cristal está fuera de lugar. ¡Revisa el orden!</span></>
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
                  className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-tertiary hover:text-white transition-colors cursor-pointer z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                  <div className="flex items-center gap-3 text-accent-yellow mb-6">
                    <HelpCircle className="w-8 h-8" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Sabiduría Decimal</h3>
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="p-6 bg-dark-bg/50 rounded-2xl border-2 border-white/5">
                      <h4 className="text-lg font-bold text-accent-yellow mb-2">¿Cómo comparar decimales?</h4>
                      <p className="text-text-secondary dark:text-white/80 leading-relaxed mb-4">
                        1. **Compara la parte entera** (antes de la coma). 10,5 es mayor que 9,9.
                        <br/>2. Si son iguales, **compara los décimos** (primera cifra decimal). 8,50 es mayor que 8,05.
                        <br/>3. Continúa con centésimos si es necesario.
                      </p>
                      
                      <div className="bg-dark-bg p-4 rounded-xl border border-white/10 font-mono text-center">
                        <div className="mb-2">8,04 &lt; 8,35 &lt; 9,26</div>
                      </div>
                    </div>

                    <div className="p-6 bg-accent-yellow/10 rounded-2xl border-2 border-accent-yellow/20">
                      <h4 className="font-black text-accent-yellow uppercase text-sm mb-2">Truco del Mago</h4>
                      <p className="text-sm text-text-secondary dark:text-white/70 italic">
                        "¡Iguala las cifras! Puedes añadir ceros invisibles al final. 8,5 es lo mismo que 8,50. Así es más fácil ver cuál es mayor."
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
