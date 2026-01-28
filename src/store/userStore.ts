import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStats {
  totalProblemsSolved: number
  totalAttempts: number
  totalPoints: number
  lastPlayedTimestamp: number | null
  currentStreak: number
}

interface UserState {
  username: string | null
  heroName: string | null
  selectedCharacter: string | null
  completedLevels: string[] // Array of island/level IDs
  stats: UserStats
  setProfile: (username: string, heroName: string) => void
  setSelectedCharacter: (characterId: string) => void
  recordResult: (points: number, wasCorrect: boolean) => void
  completeLevel: (levelId: string) => void
  logout: () => void
}

const INITIAL_STATS: UserStats = {
  totalProblemsSolved: 0,
  totalAttempts: 0,
  totalPoints: 0,
  lastPlayedTimestamp: null,
  currentStreak: 0,
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: null,
      heroName: null,
      selectedCharacter: null,
      completedLevels: [],
      stats: INITIAL_STATS,
      setProfile: (username, heroName) => set({ username, heroName }),
      setSelectedCharacter: (characterId) => set({ selectedCharacter: characterId }),
      recordResult: (points, wasCorrect) => {
        const { stats } = get()
        const now = new Date()
        const todayStr = now.toLocaleDateString('en-CA') // YYYY-MM-DD format
        
        let newStreak = stats.currentStreak
        const lastDateStr = stats.lastPlayedTimestamp 
          ? new Date(stats.lastPlayedTimestamp).toLocaleDateString('en-CA')
          : null

        if (!lastDateStr) {
          // First time playing
          newStreak = 1
        } else if (lastDateStr !== todayStr) {
          // It's a different day than the last play
          const lastDate = new Date(lastDateStr)
          const todayDate = new Date(todayStr)
          const diffTime = todayDate.getTime() - lastDate.getTime()
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays === 1) {
            // Consecutive day
            newStreak += 1
          } else if (diffDays > 1) {
            // Streak broken
            newStreak = 1
          }
          // If diffDays < 0 (unlikely clock rollback), we keep as is
        }
        // If lastDateStr === todayStr, newStreak stays the same (no double increment)

        set({
          stats: {
            ...stats,
            totalPoints: stats.totalPoints + points,
            totalAttempts: stats.totalAttempts + 1,
            totalProblemsSolved: wasCorrect 
              ? stats.totalProblemsSolved + 1 
              : stats.totalProblemsSolved,
            lastPlayedTimestamp: now.getTime(),
            currentStreak: newStreak,
          }
        })
      },
      completeLevel: (levelId) => {
        const { completedLevels } = get()
        if (!completedLevels.includes(levelId)) {
          set({ completedLevels: [...completedLevels, levelId] })
        }
      },
      logout: () => set({ username: null, heroName: null, selectedCharacter: null, completedLevels: [], stats: INITIAL_STATS }),
    }),
    {
      name: 'math-hero-storage',
    }
  )
)
