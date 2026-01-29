// Character sprites metadata
const BASE_URL = import.meta.env.BASE_URL

export const CHARACTERS = [
  { id: 'mz-evil-5', path: `${BASE_URL}sprites/characters/8D MZevil5[VS8].png`, name: 'Zevil V' },
  { id: 'actor-2-4', path: `${BASE_URL}sprites/characters/8D actor 2-4[VS8].png`, name: 'Caballero Ámbar' },
  { id: 'actor-3-5', path: `${BASE_URL}sprites/characters/8D actor 3-5[VS8].png`, name: 'Sabio Esmeralda' },
  { id: 'actor-3-7', path: `${BASE_URL}sprites/characters/8D actor 3-7[VS8].png`, name: 'Guardián del Bosque' },
  { id: 'actor1-1', path: `${BASE_URL}sprites/characters/8D actor1-1[VS8].png`, name: 'Héroe del Amanecer' },
  { id: 'actor1-2', path: `${BASE_URL}sprites/characters/8D actor1-2[VS8].png`, name: 'Paladín Azur' },
  { id: 'actor1-3', path: `${BASE_URL}sprites/characters/8D actor1-3[VS8].png`, name: 'Maga Escarlata' },
  { id: 'actor1-4', path: `${BASE_URL}sprites/characters/8D actor1-4[VS8].png`, name: 'Bifurcador de Rayos' },
  { id: 'actor1-5', path: `${BASE_URL}sprites/characters/8D actor1-5[VS8].png`, name: 'Explorador del Viento' },
  { id: 'actor1-6', path: `${BASE_URL}sprites/characters/8D actor1-6[VS8].png`, name: 'Caballero del Sol' },
  { id: 'actor1-7', path: `${BASE_URL}sprites/characters/8D actor1-7[VS8].png`, name: 'Centinela Plateada' },
  { id: 'actor1-8', path: `${BASE_URL}sprites/characters/8D actor1-8[VS8].png`, name: 'Eratega Maestro' },
  { id: 'monster-4', path: `${BASE_URL}sprites/characters/8D monster-4 [VS8].png`, name: 'Bestia Rúnica' },
  { id: 'nature7', path: `${BASE_URL}sprites/characters/8D nature7 [VS8].png`, name: 'Espíritu Natural' },
];

export type CharacterId = typeof CHARACTERS[number]['id'];
