import Immutable from 'immutable'
import { useCallback, useEffect, useState } from 'react'

import { GroupedMaterials, LeveledMaterials, Resource } from '../materials.service'

export type LevelsManager = {
  loaded: boolean
  totalLevels: number
  level: number
  progress: number
  selectedLevel: number
  hasMinLevels: boolean
  setSelectedLevel: (selectedLevel: number) => void
  setTotalLevels: (totalLevels: number) => void
  updateLevel: (
    leveledMaterials: LeveledMaterials,
    completeResources: Immutable.Set<number>
  ) => void
}

const MIN_LEVELS = 1

export function useLevels(): LevelsManager {
  const [loaded, setLoaded] = useState(false)
  const [totalLevels, setTotalLevels] = useState(0)
  const [level, setLevel] = useState(1)
  const [progress, setProgress] = useState(0)
  const [selectedLevel, setSelectedLevel] = useState(1)

  const hasMinLevels = totalLevels >= MIN_LEVELS

  const updateLevel = useCallback(
    (leveledMaterials: LeveledMaterials, completeResources: Immutable.Set<number>) => {
      const newLevel = computeLevel(leveledMaterials, completeResources)
      setLevel(newLevel)
      setProgress(
        newLevel > leveledMaterials.length
          ? 0
          : computeProgress(leveledMaterials[newLevel - 1], completeResources)
      )
      setLoaded(true)
    },
    []
  )

  /* Select next level when level complete */
  useEffect(() => {
    if (level <= totalLevels) setSelectedLevel(level)
  }, [level, totalLevels])

  return {
    loaded,
    totalLevels,
    level,
    progress,
    selectedLevel,
    hasMinLevels,
    setSelectedLevel,
    setTotalLevels,
    updateLevel,
  }
}

export function groupByLevel(rawMaterials: Resource[]): [LeveledMaterials, GroupedMaterials] {
  /* Note: We cannot use fill({}) here as fill passes a reference */
  const leveledMaterials = Array.from(Array(highestMaterialLevel(rawMaterials)), (_) => ({}))
  const unleveledMaterials: GroupedMaterials = {}

  rawMaterials.forEach((resource) => {
    const level = parseLevel(resource)
    const materials = level ? leveledMaterials[level - 1] : unleveledMaterials

    /* Define a group for the materials if not present */
    if (!Object.keys(materials).includes(resource.category)) {
      materials[resource.category] = []
    }

    materials[resource.category].push(resource)
  })
  return [leveledMaterials, unleveledMaterials]
}

/* Calculate highest level in a group of materials */
function highestMaterialLevel(rawMaterials: Resource[]): number {
  return rawMaterials.length === 0 ? 0 : Math.max(...rawMaterials.map(parseLevel))
}

/* Parse resource level from week tags (defaults to 0 if not tagged with a week) */
function parseLevel(resource: Resource): number {
  const weekMatch = `${resource.tags}`.match(/week[^\d]*(\d*)[^\d]*/i)
  return weekMatch ? parseInt(weekMatch[1]) : 0
}

/* Computes current level in leveled materials given the set of complete resources */
function computeLevel(
  leveledMaterials: LeveledMaterials,
  completeResources: Immutable.Set<number>
): number {
  const firstIncompleteLevelIndex = leveledMaterials.findIndex(
    (groupedMaterials) => computeProgress(groupedMaterials, completeResources) !== 100
  )

  return (
    (firstIncompleteLevelIndex === -1 ? leveledMaterials.length : firstIncompleteLevelIndex) + 1
  )
}

/* Computes the percentage of resources that are complete in a level */
function computeProgress(
  levelMaterials: GroupedMaterials,
  completeResources: Immutable.Set<number>
) {
  const resources = Object.values(levelMaterials).flat()
  const completeInLevel = resources.filter((resource) => completeResources.contains(resource.id))
  return resources.length === 0 ? 100 : (completeInLevel.length / resources.length) * 100
}
