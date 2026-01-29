import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle } from 'lucide-react'
import { CHARACTERS } from '../constants/characters'
import CharacterPreview from './CharacterPreview'

interface AvatarModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCharacter: string | null
  onSelect: (id: string) => void
}

export default function AvatarModal({ isOpen, onClose, selectedCharacter, onSelect }: AvatarModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark-bg/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-dark-card border-4 border-accent-yellow rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(244,224,77,0.2)] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-text-tertiary hover:text-white transition-colors z-10 cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative z-10">
              <h2 className="text-3xl font-black gradient-text mb-2 uppercase tracking-tighter">
                Selecciona tu Avatar
              </h2>
              <p className="text-text-secondary mb-8">
                Elige el rostro que te representará en el salón de la fama.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                {CHARACTERS.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => {
                      onSelect(char.id)
                      // Optionally close on select, but maybe user wants to see preview
                    }}
                    className={`
                      relative group p-4 rounded-2xl border-2 transition-all cursor-pointer
                      ${selectedCharacter === char.id 
                        ? 'border-accent-yellow bg-accent-yellow/5' 
                        : 'border-white/5 hover:border-accent-yellow/50 hover:bg-white/5'}
                    `}
                  >
                    <div className="h-24 flex items-center justify-center mb-2 overflow-hidden">
                      <CharacterPreview 
                        spritePath={char.path} 
                        width={64} 
                        height={64} 
                        scale={1.5}
                        isAnimated={selectedCharacter === char.id}
                      />
                    </div>
                    <p className={`text-[10px] font-bold text-center uppercase tracking-tighter line-clamp-1
                      ${selectedCharacter === char.id ? 'text-accent-yellow' : 'text-text-secondary'}`}>
                      {char.name}
                    </p>
                    {selectedCharacter === char.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-accent-yellow fill-dark-bg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-accent-yellow text-dark-bg font-black rounded-xl hover:scale-105 transition-smooth uppercase tracking-wider cursor-pointer"
                >
                  Confirmar Selección
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
