import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, X } from 'lucide-react'

interface Slide {
  image: string
  text: string
}

interface StoryDialogueProps {
  slides: Slide[]
  onClose: () => void
}

export default function StoryDialogue({ slides, onClose }: StoryDialogueProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden bg-black/95 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-5xl flex flex-col bg-dark-bg rounded-[2rem] border-[6px] border-accent-yellow shadow-glow overflow-hidden"
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white transition-colors border border-white/20 shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Narrative Image Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center p-4"
            >
              <img 
                src={slides[currentSlide].image} 
                alt={`Story scene ${currentSlide + 1}`}
                className="max-h-[55vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Subtle vignette on image */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Text Frame (RPG Dialog Style) */}
        <div className="bg-dark-card border-t-[6px] border-accent-yellow p-6 md:p-10 relative">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide + '-text'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="min-h-[100px] mb-8"
              >
                <p className="text-text-primary dark:text-white text-base md:text-xl leading-relaxed font-medium text-center italic">
                  "{slides[currentSlide].text}"
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                {currentSlide > 0 ? (
                  <button 
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-text-tertiary hover:text-accent-yellow transition-colors font-bold uppercase tracking-widest text-xs py-2 px-4 bg-white/5 rounded-lg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Regresar
                  </button>
                ) : <div className="w-24" />}
              </div>

              <div className="flex items-center gap-6">
                {/* Progress Dots */}
                <div className="hidden sm:flex gap-2">
                  {slides.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-accent-yellow w-6' : 'bg-accent-yellow/20'}`} 
                    />
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-accent-yellow text-dark-bg px-8 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-glow uppercase tracking-wider text-sm"
                >
                  {currentSlide === slides.length - 1 ? '¡Iniciar mi viaje!' : 'Siguiente'}
                  {currentSlide < slides.length - 1 && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent-yellow/30" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent-yellow/30" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent-yellow/30" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent-yellow/30" />
        </div>
      </motion.div>
    </div>
  )
}
