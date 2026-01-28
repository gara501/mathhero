export interface Achievement {
  id: string
  name: string
  description: string
  icon: string // Lucide icon name or emoji
  color: string
}

export const MEDALS: Achievement[] = [
  { id: 'm1', name: 'Medalla de Bronce', description: 'Nivel 1 Superado', icon: '🥉', color: 'text-amber-600' },
  { id: 'm2', name: 'Medalla de Plata', description: 'Nivel 2 Superado', icon: '🥈', color: 'text-slate-400' },
  { id: 'm3', name: 'Medalla de Oro', description: 'Nivel 3 Superado', icon: '🥇', color: 'text-yellow-400' },
  { id: 'm4', name: 'Medalla de Platino', description: 'Nivel 4 Superado', icon: '💍', color: 'text-blue-100' },
  { id: 'm5', name: 'Gema de Rubí', description: 'Nivel 5 Superado', icon: '💎', color: 'text-red-500' },
  { id: 'm6', name: 'Gema de Esmeralda', description: 'Nivel 6 Superado', icon: '✳️', color: 'text-emerald-500' },
  { id: 'm7', name: 'Gema de Zafiro', description: 'Nivel 7 Superado', icon: '🔷', color: 'text-blue-500' },
  { id: 'm8', name: 'Diamante Estelar', description: 'Nivel 8 Superado', icon: '✨', color: 'text-cyan-300' },
  { id: 'm9', name: 'Medalla del Maestro', description: 'Nivel 9 Superado', icon: '🎓', color: 'text-indigo-400' },
  { id: 'm10', name: 'Gran Maestro', description: 'Nivel 10 Superado', icon: '🧠', color: 'text-purple-500' },
  { id: 'm11', name: 'Medalla del Héroe', description: 'Nivel 11 Superado', icon: '🦸', color: 'text-red-600' },
  { id: 'm12', name: 'Medalla de la Leyenda', description: 'Nivel 12 Superado', icon: '📜', color: 'text-orange-500' },
  { id: 'm13', name: 'Medalla Mítica', description: 'Nivel 13 Superado', icon: '🐉', color: 'text-fuchsia-500' },
  { id: 'm14', name: 'Medalla Divina', description: 'Nivel 14 Superado', icon: '⚡', color: 'text-yellow-300' },
  { id: 'm15', name: 'Medalla del Infinito', description: 'Nivel 15 Superado', icon: '♾️', color: 'text-white' },
]

export const SKILLS: Achievement[] = [
  { id: 's1', name: 'Cálculo Mental', description: 'Rapidez en operaciones básicas', icon: '⚡', color: 'text-yellow-400' },
  { id: 's2', name: 'Lógica Numérica', description: 'Entendimiento de secuencias', icon: '🔢', color: 'text-blue-400' },
  { id: 's3', name: 'Patrones Visuales', description: 'Identificación de regularidades', icon: '🧩', color: 'text-green-400' },
  { id: 's4', name: 'Velocidad Matemática', description: 'Agilidad bajo presión', icon: '🏃', color: 'text-orange-400' },
  { id: 's5', name: 'Resolución de Crisis', description: 'Dominio de problemas complejos', icon: '🛠️', color: 'text-red-400' },
  { id: 's6', name: 'Pensamiento Crítico', description: 'Análisis profundo de problemas', icon: '🔍', color: 'text-cyan-400' },
  { id: 's7', name: 'Razonamiento Estratégico', description: 'Planificación de soluciones', icon: '♟️', color: 'text-amber-400' },
  { id: 's8', name: 'Lógica Abstracta', description: 'Manejo de conceptos no visibles', icon: '🌌', color: 'text-indigo-400' },
  { id: 's9', name: 'Intuición Matemática', description: 'Sentido innato de los números', icon: '👁️', color: 'text-purple-400' },
  { id: 's10', name: 'Método Científico', description: 'Rigor y experimentación', icon: '🧪', color: 'text-emerald-400' },
  { id: 's11', name: 'Lógica Universal', description: 'Conexión entre dimensiones', icon: '🌍', color: 'text-blue-600' },
  { id: 's12', name: 'Maestría del Caos', description: 'Orden en la aleatoriedad', icon: '🌪️', color: 'text-slate-600' },
  { id: 's13', name: 'Cálculo Cuántico', description: 'Procesamiento paralelo mental', icon: '⚛️', color: 'text-blue-300' },
  { id: 's14', name: 'Realidad Dimensional', description: 'Salto entre geometrías', icon: '🌀', color: 'text-rose-500' },
  { id: 's15', name: 'Omnisciencia', description: 'Conocimiento absoluto del todo', icon: '👁️‍🗨️', color: 'text-white' },
]
