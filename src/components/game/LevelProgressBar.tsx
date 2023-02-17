import { useEffect, useRef, useState } from 'react'

import { GameElement } from '../../styles/game/game.style'
import { ProgressBar } from '../statistics/ProgressBar'
import { NumberedStar } from '../statistics/numberedIcons'

const TRANSITION_TIME = 500

export const LevelProgressBar = ({
  level,
  levelProgress,
}: {
  level: number
  levelProgress: number
}) => {
  const [barProgress, setBarProgress] = useState(0)

  /**
   * Used to track if level changed due to user progression or just due to level being recalculated.
   * For example, if a resource is deleted, the level may change, but there should be no level-up animation.
   * TODO: There must be a better way of managing the animation...
   */
  const hasProgressed = useRef(false)

  /* level-up animation */
  useEffect(() => {
    if (hasProgressed.current) {
      hasProgressed.current = false
      setBarProgress(100)
      const timer = setTimeout(() => {
        setBarProgress(0)
      }, TRANSITION_TIME)
      return () => clearTimeout(timer)
    }
  }, [level])

  /* Progress animation */
  useEffect(() => {
    const timeout = hasProgressed.current ? 0 : 2 * TRANSITION_TIME
    const timer = setTimeout(() => {
      hasProgressed.current = true
      setBarProgress(levelProgress)
    }, timeout)
    return () => clearTimeout(timer)
  }, [levelProgress, level])

  return (
    <GameElement css={{ width: '80%', gap: '0.5rem' }}>
      <NumberedStar size={44} value={level} />
      <ProgressBar progress={barProgress} />
    </GameElement>
  )
}
