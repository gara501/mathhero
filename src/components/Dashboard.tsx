import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import WorldMap from './WorldMap'
import { useUserStore } from '../store/userStore'
import { CHARACTERS } from '../constants/characters'
import CharacterPreview from './CharacterPreview'
import StoryDialogue from './StoryDialogue'
import mathlogo from '../assets/mathherologo.jpg'
import slide1 from '../assets/slides/slide1.png'
import slide2 from '../assets/slides/slide2.png'
import slide3 from '../assets/slides/slide3.png'
import { BookOpen } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { username, heroName, logout } = useUserStore()
  const [showStory, setShowStory] = useState(false)

  if (!username) {
    navigate('/')
    return null
  }


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12 flex justify-center relative">
      {/* Background Image with Alpha */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}mathbg.png)` }}
      />

      <ThemeToggle />

      <motion.div
        className="flex-col mx-auto max-w-7xl gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={mathlogo} alt="MathHero Logo" className="w-32 h-16 rounded-full" />
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">MathHero</h1>
            </div>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => navigate('/profile')}
                className="w-16 h-16 bg-dark-bg/50 rounded-full border-2 border-accent-yellow flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-smooth select-none"
              >
                {useUserStore.getState().selectedCharacter ? (
                  <CharacterPreview 
                    spritePath={CHARACTERS.find(c => c.id === useUserStore.getState().selectedCharacter)?.path || ''} 
                    width={64}
                    height={64}
                    scale={1.5}
                  />
                ) : (
                  <User className="w-8 h-8 text-accent-yellow" />
                )}
              </div>
              <div>
                <p className="text-primary text-lg flex items-center gap-2">
                  Bienvenido, <span className="text-accent-yellow font-bold uppercase tracking-wider">{username}</span>
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-text-tertiary text-sm italic !font-normal">alias {heroName}</span>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="text-[14px] bg-accent-yellow/10 dark:bg-accent-yellow/10 text-accent-red px-2 py-0.5 rounded border border-accent-red/20 hover:bg-accent-red/20 dark:hover:bg-accent-red/20 transition-smooth cursor-pointer"
                  >
                    Configurar Perfil
                  </button>
                  <button 
                    onClick={() => setShowStory(true)}
                    className="text-[14px] cursor-pointer bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-smooth flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    Historia
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="px-4 py-2 text-lg dark:text-primary dark:hover:text-red-400 text-primary hover:text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </motion.div>


        {/* Interactive Map */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Explora el Reino</h2>
          <WorldMap />
        </motion.div>
       

        {/* Footer Info */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-primary dark:text-primary text-lg">
            Empieza tu aventura, selecciona un mundo para comenzar
          </p>
        </motion.div>
      </motion.div>

      {/* Story Dialogue Modal */}
      {showStory && (
        <StoryDialogue 
          onClose={() => setShowStory(false)}
          slides={[
            {
              image: slide1,
              text: "Eres un héroe en formación. Tu viaje comienza en la Isla de las Matemáticas, un lugar donde cada sendero es un desafío y cada reto es una lección. Aquí no solo pondrás a prueba tu ingenio: interiorizarás el conocimiento científico que forjará tu mente y definirá quién estás destinado a ser."
            },
            {
              image: slide2,
              text: "Con cada prueba superada, te acercas al dominio del poder de la ciencia dimensional. Este poder, reservado para quienes perseveran, es la única fuerza capaz de enfrentar a la Legión Oscura: una raza ancestral que recorre la galaxia robando el conocimiento de las especies, condenándolas a la ignorancia y al estancamiento."
            },
            {
              image: slide3,
              text: "Cuando desarrolles todo tu potencial matemático, se abrirá ante ti un nuevo destino. Podrás unirte a la Legión de Defensa, un grupo de héroes que ha convertido la ciencia en su arma más poderosa. El futuro de la galaxia está en juego, y tu preparación comienza ahora."
            }
          ]}
        />
      )}
    </div>
  )
}
