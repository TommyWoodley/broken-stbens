import { plainToInstance } from 'class-transformer'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { TIMELINE_DEFAULT_VIEW_LABEL, TIMELINE_TRACK_HEIGHT } from '../constants/global'
import { Exercise, Module, Term } from '../types/schemas/abc'
import { TrackMap } from '../types/timeline'
import { AxiosContext } from './axios.context'
import { useTerms } from './terms.service'
import { useToast } from './toast.context'
import { useUser } from './user.context'
import {
  generateTrackMap,
  groupByProperty,
  now,
  padForModulesWithNoExercises,
  sortObjectByKey,
} from './utilities.service'

export interface UseTimelineVars {
  terms: Term[]
  term: Term
  modulesForTerm: Module[]
  trackMapForTerm: TrackMap
  rowHeights: { [code: string]: string }
  setTerm: (_: Term) => void
  setModulesCohortFilter: (_: string) => void
}

function termToNumber({ name }: Term): number {
  if (name === 'autumn term') return 1
  if (name === 'spring term') return 2
  if (name === 'summer term') return 3
  return -1
}

export const useTimeline = (): any => {
  const { userDetails } = useUser()
  const { year } = useParams()
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()

  const terms = useTerms()

  const [term, setTerm] = useState<Term>()
  useEffect(() => {
    if (terms.length > 0) {
      setTerm(terms.find((term: Term) => term.start < now() && term.end > now()) || terms[0])
    }
  }, [terms])

  const [modulesForCohort, setModulesForCohort] = useState<Module[]>(
    userDetails?.modules as Module[]
  )
  const [modulesCohortFilter, setModulesCohortFilter] = useState<string>(
    TIMELINE_DEFAULT_VIEW_LABEL
  )
  useEffect(() => {
    if (!year) return
    if (modulesCohortFilter === TIMELINE_DEFAULT_VIEW_LABEL)
      setModulesForCohort(userDetails?.modules as Module[])
    else {
      axiosInstance
        .request({
          method: 'GET',
          url: endpoints.modules(year),
          params: { cohort: modulesCohortFilter },
        })
        .then(({ data }: { data: any }) => {
          if (!data?.length) setModulesForCohort([])
          setModulesForCohort(data.map((m: any) => plainToInstance(Module, m)))
        })
        .catch(() =>
          addToast({
            variant: 'error',
            title: `Unable to fetch modules for cohort '${modulesCohortFilter}'`,
          })
        )
    }
  }, [addToast, axiosInstance, year, modulesCohortFilter, userDetails?.modules])

  const [exercises, setExercises] = useState<{ [code: string]: Exercise[] }>({})
  useEffect(() => {
    axiosInstance
      .request({
        url: endpoints.exercises(year!),
        method: 'GET',
        params: { module_code: modulesForCohort.map((m) => m.code) },
      })
      .then(({ data }: { data: any }) => {
        const deserialisedExercises = data.map((e: any) => plainToInstance(Exercise, e))
        setExercises(
          groupByProperty(deserialisedExercises, 'moduleCode', 'number') as {
            [code: string]: Exercise[]
          }
        )
      })
  }, [year, modulesForCohort, axiosInstance])

  const [modulesForTerm, setModulesForTerm] = useState<Module[]>([])
  useEffect(() => {
    if (!term) return

    const moduleCodesForExercisesInTerm = (Object.values(exercises) as Exercise[][])
      .flat()
      .filter((e) => e.deadline > term.start && e.startDate < term.end)
      .map((e) => e.moduleCode)

    // For given term, show only modules
    // (a) taught in that term or
    // (b) whose exercises fall within the term's start and end dates.
    const modulesToShow = modulesForCohort
      .filter(
        (module) =>
          module.terms.includes(termToNumber(term)) ||
          moduleCodesForExercisesInTerm.includes(module.code)
      )
      .sort((m1, m2) => (m1.code < m2.code ? -1 : 1))
    setModulesForTerm(modulesToShow)
  }, [term, exercises, modulesCohortFilter, modulesForCohort])

  const [trackMapForTerm, setTrackMapForTerm] = useState<TrackMap>({})
  useEffect(() => {
    if (!term) return

    const moduleCodesForTerm = modulesForTerm.map((m) => m.code)
    const trackMap: TrackMap = sortObjectByKey(
      padForModulesWithNoExercises(moduleCodesForTerm, generateTrackMap(exercises, term))
    )
    setTrackMapForTerm(
      Object.fromEntries(
        Object.entries(trackMap).filter(([code, _]) => moduleCodesForTerm.includes(code))
      )
    )
  }, [exercises, modulesForTerm, term])

  const [rowHeights, setRowHeights] = useState<{ [code: string]: string }>({})
  useEffect(() => {
    setRowHeights(
      Object.entries(trackMapForTerm).reduce(
        (accumulator: { [code: string]: string }, [code, tracks]): { [code: string]: string } => {
          accumulator[code] = `calc(${TIMELINE_TRACK_HEIGHT} * ${tracks.length || 1})`
          return accumulator
        },
        {}
      )
    )
  }, [trackMapForTerm])

  return {
    terms,
    term,
    modulesForTerm,
    trackMapForTerm,
    rowHeights,
    setTerm,
    setModulesCohortFilter,
  }
}
