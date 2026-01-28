import { useMemo } from 'react'
import { useUserStore } from '../store/userStore'

export function useStats() {
  const stats = useUserStore((state) => state.stats)

  const derivedStats = useMemo(() => {
    const precision = stats.totalAttempts > 0 
      ? Math.round((stats.totalProblemsSolved / stats.totalAttempts) * 100)
      : 0

    return {
      solved: stats.totalProblemsSolved,
      precision: `${precision}%`,
      streak: `${stats.currentStreak} días`,
      totalPoints: stats.totalPoints,
      // For trends, we can implement more complex logic later if needed
      precisionTrend: 0,
      solvedTrend: 0,
      streakTrend: 0
    }
  }, [stats])

  return derivedStats
}
