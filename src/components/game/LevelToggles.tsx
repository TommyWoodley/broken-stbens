import { useEffect, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Lock } from 'react-bootstrap-icons'

import { LevelsManager } from '../../lib/game/levels.service'
import { range } from '../../lib/utilities.service'
import { Wrapper } from '../../styles/_app.style'
import { ScrollArrow, Toggle, ToggleGroup } from '../../styles/game/LevelToggles.style'
import { GameElement } from '../../styles/game/game.style'

export const LEVEL_GROUP_SIZE = 4

/* Roughly inspired by https://mui.com/material-ui/react-tabs/#scrollable-tabs */
export const LevelToggles = ({
  totalLevels,
  level,
  selectedLevel,
  setSelectedLevel,
}: LevelsManager) => {
  /* Index of selected group of level toggles */
  const [groupIndex, setScrollPos] = useState(0)

  const minLevelInGroup = groupIndex * LEVEL_GROUP_SIZE + 1
  const maxLevelInGroup = Math.min((groupIndex + 1) * LEVEL_GROUP_SIZE, totalLevels)

  const isLeftmostGroup = minLevelInGroup === 1
  const isRightmostGroup = maxLevelInGroup === totalLevels

  const levelToggleGenerator = (toggleLevel: number) => {
    const isLocked = toggleLevel > level
    const isComplete = toggleLevel < level

    return (
      <Toggle disabled={isLocked} key={toggleLevel} value={toggleLevel.toString()}>
        <Wrapper css={{ justifyContent: 'center' }} inline>
          <span>Level {toggleLevel}</span>
          {isLocked && <Lock size={16} />}
          {isComplete && <Check size={22} />}
        </Wrapper>
      </Toggle>
    )
  }

  useEffect(() => setScrollPos(Math.floor((selectedLevel - 1) / LEVEL_GROUP_SIZE)), [selectedLevel])

  return (
    <GameElement css={{ marginBottom: '1rem' }}>
      <ScrollArrow
        disabled={isLeftmostGroup}
        tabIndex={isLeftmostGroup ? -1 : 0}
        onClick={() => setScrollPos(isLeftmostGroup ? groupIndex : groupIndex - 1)}
      >
        <ChevronLeft size={22} />
      </ScrollArrow>
      <ToggleGroup
        type="single"
        value={selectedLevel.toString()}
        onValueChange={(value) => {
          if (value) setSelectedLevel(parseInt(value))
        }}
      >
        {range(minLevelInGroup, maxLevelInGroup + 1).map(levelToggleGenerator)}
      </ToggleGroup>
      <ScrollArrow
        disabled={isRightmostGroup}
        tabIndex={isRightmostGroup ? -1 : 0}
        onClick={() => setScrollPos(isRightmostGroup ? groupIndex : groupIndex + 1)}
      >
        <ChevronRight size={22} />
      </ScrollArrow>
    </GameElement>
  )
}
