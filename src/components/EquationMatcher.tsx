import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, MousePointer2 } from 'lucide-react'

interface Equation {
  id: string
  term1: number
  term2: number
  operator: string
  result: number
  missingValue: number
  userValue: number | null
}

interface EquationMatcherProps {
  operator: '+' | '-' | '*' | '/'
  totalRounds: number
  equationsPerRound: number
  onLevelComplete: (totalPoints: number) => void
}

export default function EquationMatcher({ 
  operator, 
  totalRounds = 10, 
  equationsPerRound = 5,
  onLevelComplete
}: EquationMatcherProps) {
  const [currentRound, setCurrentRound] = useState(1)
  const [equations, setEquations] = useState<Equation[]>([])
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([])
  const [draggingNumber, setDraggingNumber] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ id: string; type: 'correct' | 'incorrect' } | null>(null)
  const [roundComplete, setRoundComplete] = useState(false)

  const generateRound = useCallback(() => {
    const newEquations: Equation[] = []
    const answers: number[] = []
    const seen = new Set<string>()

    while (newEquations.length < equationsPerRound) {
      let t1, t2, res
      if (operator === '+') {
        t1 = Math.floor(Math.random() * 10) + 1
        t2 = Math.floor(Math.random() * 10) + 1
        res = t1 + t2
      } else if (operator === '-') {
        t1 = Math.floor(Math.random() * 10) + 10
        t2 = Math.floor(Math.random() * 10) + 1
        res = t1 - t2
      } else if (operator === '*') {
        t1 = Math.floor(Math.random() * 5) + 1
        t2 = Math.floor(Math.random() * 5) + 1
        res = t1 * t2
      } else {
        t2 = Math.floor(Math.random() * 5) + 1
        res = Math.floor(Math.random() * 5) + 1
        t1 = res * t2
      }

      const key = `${t1}${operator}${t2}`
      if (seen.has(key)) continue
      
      seen.add(key)
      newEquations.push({
        id: `eq-${newEquations.length}-${Date.now()}`,
        term1: t1,
        term2: t2,
        operator,
        result: res,
        missingValue: t1,
        userValue: null
      })
      answers.push(t1)
    }

    setEquations(newEquations)
    setAvailableNumbers(answers.sort(() => Math.random() - 0.5))
    setRoundComplete(false)
    setFeedback(null)
  }, [operator, equationsPerRound])

  useEffect(() => {
    generateRound()
  }, [generateRound])

  const handleDragStart = (num: number) => {
    setDraggingNumber(num)
  }

  const handleDrop = (eqId: string) => {
    if (draggingNumber === null) return

    const eq = equations.find(e => e.id === eqId)
    if (!eq || eq.userValue !== null) return

    if (draggingNumber === eq.missingValue) {
      const newEquations = equations.map(e => 
        e.id === eqId ? { ...e, userValue: draggingNumber } : e
      )
      setEquations(newEquations)
      setAvailableNumbers(prev => {
        const index = prev.indexOf(draggingNumber)
        const next = [...prev]
        next.splice(index, 1)
        return next
      })
      setFeedback({ id: eqId, type: 'correct' })
      
      // Check if round complete
      if (newEquations.every(e => e.userValue !== null)) {
        setTimeout(() => setRoundComplete(true), 500)
      }
    } else {
      setFeedback({ id: eqId, type: 'incorrect' })
      setTimeout(() => setFeedback(null), 1000)
    }
    setDraggingNumber(null)
  }

  const nextRound = () => {
    if (currentRound >= totalRounds) {
      onLevelComplete(totalRounds * equationsPerRound * 5)
    } else {
      setCurrentRound(prev => prev + 1)
      generateRound()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      {/* Round Info */}
      <div className="flex justify-between items-center mb-12">
        <div className="bg-dark-card/80 border-2 border-accent-yellow/30 px-6 py-2 rounded-2xl shadow-xl">
          <span className="text-accent-yellow font-black uppercase text-xs tracking-widest">Ronda</span>
          <p className="text-2xl font-black text-white">{currentRound} / {totalRounds}</p>
        </div>
        <div className="bg-dark-card/80 border-2 border-white/5 px-6 py-2 rounded-2xl shadow-xl">
          <span className="text-tertiary font-black uppercase text-xs tracking-widest">Objetivo</span>
          <p className="text-2xl font-black text-white">Completar 10</p>
        </div>
      </div>

      {/* Equations Board */}
      <div className="space-y-4 mb-12">
        {equations.map((eq) => (
          <div 
            key={eq.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(eq.id)}
            className="flex items-center justify-center gap-6 p-4 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 hover:border-accent-yellow/30 transition-colors"
          >
            {/* Target Slot */}
            <div 
              className={`
                w-16 h-16 rounded-xl border-4 border-dashed flex items-center justify-center text-3xl font-black transition-all
                ${eq.userValue !== null 
                  ? 'bg-green-500/20 border-green-500 text-green-500 shadow-glow' 
                  : feedback?.id === eq.id && feedback.type === 'incorrect'
                    ? 'bg-red-500/20 border-red-500 text-red-500 animate-shake'
                    : 'bg-dark-bg/50 border-gray-500 text-gray-400'
                }
              `}
            >
              {eq.userValue || '?'}
            </div>

            <span className="text-3xl font-black text-primary italic">{eq.operator}</span>
            
            <div className="w-16 h-16 rounded-xl border-4 border-gray-300 flex items-center justify-center text-3xl font-black text-primary bg-white/10">
              {eq.term2}
            </div>

            <span className="text-3xl font-black text-primary">=</span>

            <div className="w-20 h-16 rounded-xl border-4 border-gray-300 flex items-center justify-center text-3xl font-black text-primary bg-white/10">
              {eq.result}
            </div>

            <div className="w-8">
              {eq.userValue !== null && <CheckCircle2 className="text-green-500 w-6 h-6" />}
              {feedback?.id === eq.id && feedback.type === 'incorrect' && <XCircle className="text-red-500 w-6 h-6 animate-pulse" />}
            </div>
          </div>
        ))}
      </div>

      {/* Source Tray */}
      <div className="bg-accent-yellow/10 border-4 border-accent-yellow p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-2 left-6 text-[10px] font-black text-accent-yellow uppercase tracking-widest opacity-50 flex items-center gap-2">
          <MousePointer2 size={12} />
          Arrastra hacia arriba
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <AnimatePresence>
            {availableNumbers.map((num, i) => (
              <motion.div
                key={`${num}-${i}`}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                draggable
                onDragStart={() => handleDragStart(num)}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-white border-b-8 border-gray-300 rounded-2xl flex items-center justify-center text-3xl font-black text-gray-700 shadow-xl cursor-grab active:cursor-grabbing hover:bg-white"
              >
                {num}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {availableNumbers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-accent-yellow font-black uppercase tracking-widest"
          >
            ¡Ronda Completada!
          </motion.div>
        )}
      </div>

      {/* Round Footer */}
      <AnimatePresence>
        {roundComplete && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={nextRound}
              className="px-12 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest flex items-center gap-3 animate-pulse"
            >
              {currentRound === totalRounds ? 'Ver Victoria' : 'Siguiente Ronda'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
