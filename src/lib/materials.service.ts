import Immutable from 'immutable'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { AxiosContext } from './axios.context'
import { useGame } from './game/game.context'
import { LevelsManager, groupByLevel } from './game/levels.service'
import { useToast } from './toast.context'
import { concatGrouped, groupByProperty } from './utilities.service'

/* TODO: Is there any reason that we do not have a complete Resource/Material type */
export type Resource = { tags: string[]; id: number; category: string }
export type LeveledMaterials = GroupedMaterials[]
export type GroupedMaterials = { [key: string]: Resource[] }

type MaterialsManager = {
  groupedMaterials: GroupedMaterials
  setRawMaterials: (rawMaterials: Resource[]) => void
  isLoaded: () => boolean
  noMaterials: () => boolean
  addCompleteResources: (resourceIds: number[]) => void
  isComplete: (resourceId: number) => boolean
}

export const useMaterials = ({
  loaded: levelsLoaded,
  selectedLevel,
  hasMinLevels,
  setTotalLevels,
  updateLevel,
}: LevelsManager): MaterialsManager => {
  const { year } = useParams()
  const [rawMaterials, setRawMaterials] = useState<Resource[]>([])

  /* Store materials grouped by level to minimise how often we group materials into levels */
  const [leveledMaterials, setLeveledMaterials] = useState<LeveledMaterials>()
  const [unleveledMaterials, setUnleveledMaterials] = useState<GroupedMaterials>({})

  /* Store complete resources to minimise how often we hit the endpoint */
  const [completeResources, setCompleteResources] = useState<Immutable.Set<number>>()

  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()
  const { gameSettingOn } = useGame()
  const { moduleCode } = useOutletContext<{ moduleCode: string | null }>()

  const [materialsLoaded, setMaterialsLoaded] = useState(false)
  const groupedMaterials = useMemo(
    () =>
      gameSettingOn && hasMinLevels
        ? concatGrouped(unleveledMaterials, leveledMaterials?.at(selectedLevel - 1) ?? {})
        : (groupByProperty(rawMaterials, 'category', 'index', true) as GroupedMaterials),
    [gameSettingOn, rawMaterials, leveledMaterials, unleveledMaterials, selectedLevel, hasMinLevels]
  )
  useEffect(() => {
    setMaterialsLoaded(false)
    axiosInstance
      .request({
        url: endpoints.resources,
        method: 'GET',
        params: { year, course: moduleCode },
      })
      .then(({ data }: { data: any }) => {
        /* Group data by category */
        setRawMaterials(data)
        setMaterialsLoaded(true)
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Problem fetching resources' })
        console.error(error)
      })
  }, [addToast, axiosInstance, moduleCode, year])

  function isLoaded(): boolean {
    return materialsLoaded && (!gameSettingOn || levelsLoaded)
  }

  function noMaterials() {
    return Object.keys(groupedMaterials).length === 0
  }

  function isComplete(resourceId: number): boolean {
    return completeResources?.contains(resourceId) ?? false
  }

  async function addCompleteResources(resourceIds: number[]) {
    setCompleteResources(completeResources?.union<number>(resourceIds))
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.resourcesComplete,
        data: resourceIds,
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error completing material' })
        console.error(error)
      })
  }

  /* Group materials by category */
  useEffect(() => {
    if (gameSettingOn) {
      const [newLeveledMaterials, newUnleveledMaterials] = groupByLevel(rawMaterials)
      setTotalLevels(newLeveledMaterials.length)
      setUnleveledMaterials(newUnleveledMaterials)
      setLeveledMaterials(newLeveledMaterials)
    }
  }, [gameSettingOn, rawMaterials, setTotalLevels])

  /* Fetch complete resources */
  useEffect(() => {
    if (gameSettingOn) {
      axiosInstance
        .request({
          url: endpoints.resourcesComplete,
          method: 'GET',
          params: { module_code: moduleCode },
        })
        .then(({ data }) => {
          setCompleteResources(Immutable.Set<number>(data))
        })
        .catch((error) => {
          addToast({ variant: 'error', title: 'Error fetching complete materials' })
          console.error(error)
        })
    }
  }, [addToast, gameSettingOn, axiosInstance, moduleCode])

  /* Update the user level and progress */
  useEffect(() => {
    if (gameSettingOn && leveledMaterials && completeResources) {
      updateLevel(leveledMaterials, completeResources)
    }
  }, [gameSettingOn, completeResources, leveledMaterials, updateLevel])

  return {
    groupedMaterials,
    setRawMaterials,
    isLoaded,
    noMaterials,
    addCompleteResources,
    isComplete,
  }
}
