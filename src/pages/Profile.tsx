import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, User, Shield, Target, Award, Zap, Edit2, Star } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import { useStats } from '../hooks/useStats'
import { CHARACTERS } from '../constants/characters'
import CharacterPreview from '../components/CharacterPreview'
import AvatarModal from '../components/AvatarModal'
import { MEDALS, SKILLS } from '../constants/achievements'

export default function Profile() {
  const navigate = useNavigate()
  const { username, heroName, stats, selectedCharacter, setSelectedCharacter, completedLevels } = useUserStore()
  const derivedStats = useStats()
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  if (!username) {
    navigate('/')
    return null
  }

  // Calculate earned achievements based on completed levels
  const earnedMedals = MEDALS.slice(0, completedLevels.length)
  const earnedSkills = SKILLS.slice(0, completedLevels.length)

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background Image with Alpha */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        style={{ backgroundImage: 'url(mathbg.png)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-text-secondary dark:text-text-secondary hover:cursor-pointer dark:hover:text-text-tertiary hover:text-text-primary transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Card & Stats */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card text-center py-10 relative group"
            >
              <div className="flex justify-center mb-6">
                <div 
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="w-32 h-32 bg-dark-bg/50 rounded-full border-4 border-accent-yellow flex items-center justify-center overflow-hidden shadow-glow cursor-pointer hover:scale-105 transition-smooth relative"
                >
                  {selectedCharacter ? (
                    <CharacterPreview 
                      spritePath={CHARACTERS.find(c => c.id === selectedCharacter)?.path || ''} 
                      width={128}
                      height={128}
                      scale={2.5}
                    />
                  ) : (
                    <User className="w-16 h-16 text-accent-yellow opacity-50" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold gradient-text">{username}</h1>
              <p className="text-accent-yellow font-bold uppercase tracking-widest text-sm mt-1">{heroName}</p>
              
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="mt-4 text-[10px] uppercase font-black text-accent-yellow/60 hover:text-accent-yellow transition-colors tracking-tighter"
              >
                Cambiar Avatar
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-primary dark:text-text-tertiary">
                <Shield className="w-5 h-5 text-accent-yellow" /> Estadísticas Base
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-dark-bg/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-sm dark:text-text-tertiary">Resueltos</span>
                  </div>
                  <span className="font-bold text-lg dark:text-text-tertiary">{stats.totalProblemsSolved}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-bg/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-accent-yellow" />
                    <span className="text-sm dark:text-text-tertiary">Precisión</span>
                  </div>
                  <span className="font-bold text-lg dark:text-text-tertiary">{derivedStats.precision}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-bg/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <span className="text-sm dark:text-text-tertiary">Racha</span>
                  </div>
                  <span className="font-bold text-lg dark:text-text-tertiary">{derivedStats.streak}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Achievements (Medals & Skills) */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary dark:text-text-tertiary">Logros de Héroe</h2>
                  <p className="text-text-secondary dark:text-text-secondary">Tu progreso desbloquea nuevas distinciones y habilidades.</p>
                </div>
                <div className="flex items-center gap-2 bg-accent-yellow/10 px-4 py-2 rounded-full border border-accent-yellow/20">
                  <Star className="w-5 h-5 text-accent-yellow fill-accent-yellow" />
                  <span className="font-black text-accent-yellow">{completedLevels.length}/15</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Medals Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
                    <Award className="w-4 h-4 text-accent-yellow" /> Medallas Ganadas
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {MEDALS.map((medal, idx) => {
                      const isEarned = idx < completedLevels.length
                      return (
                        <div 
                          key={medal.id}
                          className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all duration-500
                            ${isEarned 
                              ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20 scale-100' 
                              : 'bg-black/20 border border-white/5 opacity-20 grayscale'}`}
                          title={isEarned ? medal.name : 'Bloqueado'}
                        >
                          {medal.icon}
                        </div>
                      )
                    })}
                  </div>
                  {earnedMedals.length > 0 ? (
                    <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-text-tertiary uppercase font-bold mb-1">Última Distinción</p>
                      <p className="text-lg font-black text-white">{earnedMedals[earnedMedals.length - 1].name}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-text-tertiary italic">Completa niveles para ganar medallas</p>
                  )}
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" /> Habilidades Desbloqueadas
                  </h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {earnedSkills.length > 0 ? (
                      earnedSkills.map((skill, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (idx * 0.05) }}
                          key={skill.id}
                          className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="text-2xl">{skill.icon}</div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">{skill.name}</p>
                            <p className="text-[10px] text-text-tertiary">{skill.description}</p>
                          </div>
                        </motion.div>
                      )).reverse() // Show newest skills first
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-sm text-text-tertiary italic">Sin habilidades aún</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AvatarModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        selectedCharacter={selectedCharacter}
        onSelect={setSelectedCharacter}
      />
    </div>
  )
}
