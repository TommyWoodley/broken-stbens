import { nextMonday } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { Term } from '../types/schemas/abc'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { now } from './utilities.service'

const TOTAL_ACADEMIC_TERMS = 3

export function useTerms(): Term[] {
  const [terms, setTerms] = useState<Term[]>([])

  const { year } = useParams()
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()

  useEffect(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.periods(year!),
      })
      .then(({ data }: { data: any }) => {
        if (!data?.length) setTerms([])
        setTerms(
          data.map(({ start, end, ...rest }: any) => ({
            start: nextMonday(new Date(start)),
            end: new Date(end),
            ...rest,
          }))
        )
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error fetching terms' })
        console.error(error)
      })
  }, [addToast, axiosInstance, year])

  return terms
}

/**
 * Find the most recent academic term.
 * i.e. the index of the most recent non-break period.
 * */
export function useRecentAcademicTerm(): { term: Term | undefined; termIndex: number } {
  const terms = useTerms()

  /* Assume periods are in ascending order of start date. */
  const recentTermIndex = [...terms]
    .reverse()
    .findIndex((term) => now() >= term.start && now() < term.end)

  /* If no periods have started yet */
  if (recentTermIndex === -1) {
    return { term: undefined, termIndex: -1 }
  }

  /* Assume each academic period is followed by a break period */
  const recentAcademicTermIndex = TOTAL_ACADEMIC_TERMS - Math.floor(recentTermIndex / 2)
  return { term: terms[(recentAcademicTermIndex - 1) * 2], termIndex: recentAcademicTermIndex }
}
