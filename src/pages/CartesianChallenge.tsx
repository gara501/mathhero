import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Sparkles, HelpCircle, X } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import WizardSprite from '../components/WizardSprite'
import LevelCompletionModal from '../components/LevelCompletionModal'
import wizardIdle from '../assets/sprites/wizard/Idle.png'

interface CartesianProblem {
  targetX: number
  targetY: number
}

export default function CartesianChallenge() {
  const navigate = useNavigate()
  const { recordResult, completeLevel } = useUserStore()
  const svgRef = useRef<SVGSVGElement>(null)
  
  const [problem, setProblem] = useState<CartesianProblem | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<{x: number, y: number} | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [isSuperado, setIsSuperado] = useState(false)
  const [problemClosed, setProblemClosed] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showHelpModal, setShowHelpModal] = useState(false)

  // SVG Config
  const width = 600
  const height = 600
  const gridSize = 50
  const centerX = width / 2
  const centerY = height / 2

  const generateProblem = () => {
    // Generate between -5 and 5 as per user's implementation
    const x = Math.floor(Math.random() * 11) - 5
    const y = Math.floor(Math.random() * 11) - 5

    setProblem({ targetX: x, targetY: y })
    setSelectedPoint(null)
    setFeedback(null)
    setProblemClosed(false)
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || problemClosed) return

    const rect = svgRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Convert SVG coords back to Cartesian (-5 to 5 range)
    // We use viewBox="0 0 600 600" so we need to scale the click coords if rect size !== 600
    const scaleX = width / rect.width
    const scaleY = height / rect.height
    
    const svgClickX = clickX * scaleX
    const svgClickY = clickY * scaleY

    const cartesianX = Math.round((svgClickX - centerX) / gridSize)
    const cartesianY = Math.round((centerY - svgClickY) / gridSize)

    // Clamp values to grid bounds (-5 to 5)
    const clampedX = Math.max(-10, Math.min(10, cartesianX))
    const clampedY = Math.max(-10, Math.min(10, cartesianY))

    setSelectedPoint({ x: clampedX, y: clampedY })
    if (feedback) setFeedback(null)
  }

  const cartesianToSVG = (x: number, y: number) => ({
    svgX: centerX + x * gridSize,
    svgY: centerY - y * gridSize,
  })

  const checkAnswer = () => {
    if (!problem || !selectedPoint || problemClosed) return

    const isCorrect = selectedPoint.x === problem.targetX && selectedPoint.y === problem.targetY

    if (isCorrect) {
      setFeedback('correct')
      setProblemClosed(true)
      recordResult(20, true)
      
      const newCount = correctCount + 1
      setCorrectCount(newCount)
      
      if (newCount >= 10) {
        completeLevel('level7')
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
        levelName="Reto Cartesiano" 
        points={correctCount * 20} 
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
                    <span className="text-xs font-black uppercase tracking-widest">Maestro del Mapa Estelar</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white mb-6 leading-tight">
                    "Las formas mágicas se han dispersado por el mapa de coordenadas. ¿Puedes localizarlas usando tu brújula matemática?"
                  </h2>

                  <button
                    onClick={() => setShowIntro(false)}
                    className="group relative px-10 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10">¡Iniciar Gran Mapa!</span>
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
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Reto Cartesiano</h1>
                  <p className="text-text-tertiary">Traza el punto en las coordenadas dadas</p>
                </div>
                <div className="card !py-2 !px-4">
                  <p className="text-xs text-text-tertiary uppercase tracking-widest mb-1">Puntería Mágica</p>
                  <p className="text-2xl font-bold text-accent-yellow">{correctCount} <span className="text-sm text-text-secondary">/ 10</span></p>
                </div>
              </div>

              <div className="flex flex-col gap-8 max-w-2xl mx-auto">
                <div className="card flex flex-col items-center justify-center p-6 md:p-8 min-h-[450px] md:min-h-[600px] bg-dark-card/30">
                  <div className="relative w-full aspect-square max-w-[500px]">
                    <svg
                      ref={svgRef}
                      viewBox={`0 0 ${width} ${height}`}
                      onClick={handleClick}
                      className="w-full h-full rounded-2xl cursor-crosshair bg-white/5 shadow-inner border-2 border-white/10"
                    >
                      {/* Grid Lines */}
                      {(() => {
                        const lines = []
                        for (let i = -width / 2; i <= width / 2; i += gridSize) {
                          lines.push(
                            <line
                              key={`v-${i}`}
                              x1={centerX + i}
                              y1={0}
                              x2={centerX + i}
                              y2={height}
                              stroke="currentColor"
                              strokeWidth="1"
                              className="text-white/10"
                            />
                          )
                          lines.push(
                            <line
                              key={`h-${i}`}
                              x1={0}
                              y1={centerY + i}
                              x2={width}
                              y2={centerY + i}
                              stroke="currentColor"
                              strokeWidth="1"
                              className="text-white/10"
                            />
                          )
                        }
                        return lines
                      })()}

                      {/* Main Axes */}
                      <line
                        x1={centerX}
                        y1={0}
                        x2={centerX}
                        y2={height}
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-white/40"
                      />
                      <line
                        x1={0}
                        y1={centerY}
                        x2={width}
                        y2={centerY}
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-white/40"
                      />

                      {/* Axis Arrows */}
                      <polygon points={`${centerX},0 ${centerX - 7},15 ${centerX + 7},15`} fill="white" fillOpacity="0.4" />
                      <polygon points={`${width},${centerY} ${width - 15},${centerY - 7} ${width - 15},${centerY + 7}`} fill="white" fillOpacity="0.4" />

                      {/* Labels */}
                      {(() => {
                        const axisLabels = []
                        for (let i = -5; i <= 5; i++) {
                          if (i !== 0) {
                            const xPos = cartesianToSVG(i, 0)
                            axisLabels.push(
                              <text
                                key={`x-l-${i}`}
                                x={xPos.svgX}
                                y={centerY + 25}
                                textAnchor="middle"
                                fontSize="14"
                                fontWeight="bold"
                                fill="currentColor"
                                className="text-text-tertiary"
                              >
                                {i}
                              </text>
                            )
                            const yPos = cartesianToSVG(0, i)
                            axisLabels.push(
                              <text
                                key={`y-l-${i}`}
                                x={centerX - 25}
                                y={yPos.svgY + 5}
                                textAnchor="middle"
                                fontSize="14"
                                fontWeight="bold"
                                fill="currentColor"
                                className="text-text-tertiary"
                              >
                                {i}
                              </text>
                            )
                          }
                        }
                        return axisLabels
                      })()}

                      {/* Axis Titles */}
                      <text x={width - 20} y={centerY - 15} fontSize="18" fontWeight="black" fill="#eab308">X</text>
                      <text x={centerX + 15} y={25} fontSize="18" fontWeight="black" fill="#eab308">Y</text>

                      {/* Selected Point */}
                      {selectedPoint && (
                        <>
                          {(() => {
                            const { svgX, svgY } = cartesianToSVG(selectedPoint.x, selectedPoint.y)
                            return (
                              <>
                                <circle
                                  cx={svgX}
                                  cy={svgY}
                                  r="10"
                                  fill="#ef4444"
                                  className="animate-pulse shadow-glow"
                                />
                                <line
                                  x1={svgX}
                                  y1={svgY}
                                  x2={svgX}
                                  y2={centerY}
                                  stroke="#ef4444"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  opacity="0.5"
                                />
                                <line
                                  x1={svgX}
                                  y1={svgY}
                                  x2={centerX}
                                  y2={svgY}
                                  stroke="#ef4444"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  opacity="0.5"
                                />
                              </>
                            )
                          })()}
                        </>
                      )}
                    </svg>
                  </div>
                </div>

                {/* Question & Controls */}
                <div className="flex flex-col gap-8">
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white mb-2">
                      Traza el punto <span className="text-accent-yellow">({problem?.targetX}, {problem?.targetY})</span> en el plano.
                    </h3>
                    <p className="text-text-tertiary text-lg italic">
                      {selectedPoint 
                        ? `Punto seleccionado: (${selectedPoint.x}, ${selectedPoint.y})` 
                        : "Haz clic en una intersección para marcar el punto"}
                    </p>
                  </div>

                  {!problemClosed ? (
                    <div className="flex justify-center">
                      <button
                        onClick={checkAnswer}
                        disabled={!selectedPoint}
                        className="px-12 py-4 bg-accent-yellow text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-tighter"
                      >
                        Lanzar Hechizo
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <button
                        onClick={generateProblem}
                        className="px-12 py-4 bg-gradient-to-r from-accent-yellow to-orange-400 text-dark-bg font-black rounded-2xl hover:shadow-glow transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-tighter"
                      >
                        <RefreshCw className="w-6 h-6" />
                        Siguiente Enigma
                      </button>
                    </motion.div>
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
                          <><CheckCircle className="w-6 h-6" /> <span className="text-xl font-bold">¡Visión estelar! Has localizado la figura.</span></>
                        ) : (
                          <><XCircle className="w-6 h-6" /> <span className="text-xl font-bold">Esa no es la figura en esas coordenadas. ¡Mira bien!</span></>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
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
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Lectura de Mapas Mágicos</h3>
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    <div className="p-6 bg-dark-bg/50 rounded-2xl border-2 border-white/5">
                      <h4 className="text-lg font-bold text-accent-yellow mb-2">El Secreto de las Coordenadas (X, Y)</h4>
                      <p className="text-text-secondary dark:text-white/80 leading-relaxed mb-4">
                        Para encontrar un objeto en el mapa, sigue estos pasos:
                        <br/>1. **X (Eje Horizontal)**: Camina hacia la derecha hasta llegar al número indicado.
                        <br/>2. **Y (Eje Vertical)**: Vuela hacia arriba hasta llegar al segundo número.
                      </p>
                      
                      <div className="bg-dark-bg p-4 rounded-xl border border-white/10 text-center flex flex-col gap-2">
                        <div className="text-sm text-text-tertiary uppercase">Ejemplo (4, 2)</div>
                        <div className="font-bold text-white">4 a la derecha → 2 hacia arriba ↑</div>
                      </div>
                    </div>

                    <div className="p-6 bg-accent-yellow/10 rounded-2xl border-2 border-accent-yellow/20">
                      <h4 className="font-black text-accent-yellow uppercase text-sm mb-2">Consejo del Mago Navegante</h4>
                      <p className="text-sm text-text-secondary dark:text-white/70 italic">
                        "¡El Eje X siempre va primero! Piénsalo como correr por el suelo antes de saltar hacia el cielo (Eje Y)."
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
