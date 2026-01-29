import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, User, ShieldCheck, RefreshCw } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import ThemeToggle from '../components/ThemeToggle'
import mathlogo from '../assets/mathherologo.jpg'

const ADJECTIVES = [
  'Valiente', 'Sabio', 'Veloz', 'Infinito', 'Místico', 
  'Lógico', 'Poderoso', 'Brillante', 'Estratega', 'Cósmico',
  'Binario', 'Integral', 'Derivado', 'Estelar', 'Galáctico'
]

const TITLES = [
  'Calculadora', 'Arquitecto', 'Guardián', 'Explorador', 'Maestro',
  'Guerrero', 'Descifrador', 'Vidente', 'Genio', 'Mago',
  'Pionero', 'Álgebra', 'Radar', 'Cerebro', 'Titán'
]

export default function Landing() {
  const navigate = useNavigate()
  const { username: existingUser, setProfile } = useUserStore()
  const [username, setUsername] = useState('')
  const [heroName, setHeroName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Redirect if user already exists
  useEffect(() => {
    if (existingUser) {
      navigate('/dashboard')
    }
  }, [existingUser, navigate])

  const generateHeroName = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
      const title = TITLES[Math.floor(Math.random() * TITLES.length)]
      const number = Math.floor(Math.random() * 999)
      setHeroName(`${adj} ${title} ${number}`)
      setIsGenerating(false)
    }, 500)
  }

  useEffect(() => {
    generateHeroName()
  }, [])

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && heroName) {
      setProfile(username.trim(), heroName)
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with Alpha */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}mathbg.png)` }}
      />

      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass p-8 rounded-[2rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex justify-center mb-4"
          >
            <img src={mathlogo} alt="MathHero Logo" className="w-40 h-20 rounded-full object-cover shadow-glow" />
          </motion.div>
          
          <h1 className="text-5xl font-bold gradient-text mb-2">MathHero</h1>
          <p className="text-text-secondary italic">Conviértete en la leyenda de las matemáticas</p>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          <div className="space-y-2">
            <label className="text-lg font-semibold text-text-secondary flex items-center gap-2 px-1">
              <User className="w-4 h-4" /> Tu Nombre Real
            </label>
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu nombre..."
              className="w-full px-4 py-3 bg-dark-card border border-border-color rounded-xl text-primary text-lg dark:text-primary focus:outline-none focus:border-accent-yellow transition-smooth shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-semibold text-text-secondary flex items-center gap-2 px-1">
              <ShieldCheck className="w-4 h-4" /> Tu Identidad de Héroe
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-dark-bg/50 border border-border-color rounded-xl text-accent-yellow font-bold flex items-center justify-between">
                <span className={isGenerating ? 'opacity-50' : 'opacity-100'}>
                  {heroName}
                </span>
                {isGenerating && <RefreshCw className="w-4 h-4 animate-spin text-text-tertiary" />}
              </div>
              <button
                type="button"
                onClick={generateHeroName}
                className="p-3 bg-dark-card border border-border-color rounded-xl hover:bg-dark-card-hover transition-smooth text-text-secondary cursor-pointer"
                title="Generar nuevo nombre"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-text-tertiary px-1">
              Se ha generado un nombre épico para proteger tu identidad.
            </p>
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isGenerating}
            className="w-full py-4 bg-gradient-to-r from-accent-yellow to-gradient-to text-dark-bg font-bold rounded-2xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            ¡COMENZAR AVENTURA!
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-text-tertiary">
                Tus datos se guardan localmente para tu próxima sesión.
            </p>
        </div>
      </motion.div>

      {/* Decorative math symbols background */}
      <div className="absolute top-10 left-10 text-4xl opacity-5 pointer-events-none select-none">∑</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-5 pointer-events-none select-none">π</div>
      <div className="absolute top-1/4 right-20 text-4xl opacity-5 pointer-events-none select-none">√</div>
      <div className="absolute bottom-1/4 left-20 text-4xl opacity-5 pointer-events-none select-none">∞</div>
    </div>
  )
}
