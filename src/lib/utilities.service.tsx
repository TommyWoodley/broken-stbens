import {
  addMonths,
  addYears,
  areIntervalsOverlapping,
  format,
  getMinutes,
  isSameMonth,
  subYears,
} from 'date-fns'
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz'

import { LONDON_TIMEZONE } from '../constants/global'
import { Exercise, Term } from '../types/schemas/abc'
import { Track, TrackMap } from '../types/timeline'

const SEPTEMBER = 8
const OCTOBER = 9

/* A file to store miscellaneous utility functions */

/**
 * Extracts the response message from an Axios error object
 */
export function errorMessage(error: any): string | null {
  const errorData = error?.response?.data || {}
  if ('message' in errorData) return errorData.message
  if ('detail' in errorData) return errorData.detail
  return null
}

/**
 * Sorts an object alphabetically by key
 */
export const sortObjectByKey = (object: { [_: string]: any }) =>
  Object.keys(object)
    .sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
    .reduce((obj: any, key) => {
      obj[key] = object[key]
      return obj
    }, {})

/**
 * Groups a given data object by the given 'groupBy' property to form a dictionary of lists. Each list of objects
 * is sorted by the 'orderBy' property.
 */
export function groupByProperty(
  data: object[],
  groupBy: string,
  orderBy: string,
  sortByKey?: boolean
): { [key: string]: object[] } {
  /* Preliminary check to make sure that the groupBy and orderBy attributes are in the data */
  if (!data.every((d) => groupBy in d && orderBy in d))
    throw Error(`'${groupBy}' and '${orderBy}' need be properties of provided objects`)
  const newObject =
    data === null
      ? {}
      : data
          .sort((a: any, b: any) => (a[orderBy] > b[orderBy] ? 1 : -1))
          .reduce(
            (groups: any, item: any) => ({
              ...groups,
              [item[groupBy]]: [...(groups[item[groupBy]] || []), item],
            }),
            {}
          )
  return sortByKey ? sortObjectByKey(newObject) : newObject
}

/** @returns the current datetime in London */
export const now = (): Date => utcToZonedTime(new Date(), LONDON_TIMEZONE)

/**
 * Compute the short year (i.e. 2021, 2122, 2223 etc.) for 'referenceDate'.
 * Defaults to today's date if no argument is given.
 *
 * It combines the last two digits of each year in the academic year.
 * eg: for the academic year 2021-2022, the short year is 2122
 */
export const shortYear = (referenceDate?: Date): string => {
  const date = referenceDate ?? now()
  const currentYear = format(date, 'yy')
  const complementYear = format(addYears(date, date.getMonth() < OCTOBER ? -1 : 1), 'yy')
  return date.getMonth() < OCTOBER ? complementYear + currentYear : currentYear + complementYear
}

/**
 * Get the enabled academic years
 * NOTE: Materials from before 21-22 have been wiped, so we don't offer them.
 */
const BASE_YEAR = 2021
export const validShortYears = (): string[] => {
  let years = []
  let date = now()

  // Add look-ahead in September
  if (date.getMonth() === SEPTEMBER) years.unshift(shortYear(addMonths(date, 1)))

  while (date >= new Date(BASE_YEAR, OCTOBER, 1)) {
    years.unshift(shortYear(date))
    date = subYears(date, 1)
  }

  if (process.env.NODE_ENV === 'development' && !years.includes('2223')) years.push('2223')

  return years
}

export const formatShortYear = (year: string = shortYear()): string => {
  if (year?.length !== 4) return ''
  return `20${year.slice(0, 2)}-${year.slice(2, 4)}`
}

/* Returns whether the given two exercises overlap */
export const exercisesOverlap = (e1: Exercise, e2: Exercise): boolean => {
  const dropTimeInfo = (d: Date) => new Date(d.toDateString())
  const [e1StartDate, e1EndDate] = [e1.startDate, e1.deadline].map(dropTimeInfo)
  const [e2StartDate, e2EndDate] = [e2.startDate, e2.deadline].map(dropTimeInfo)
  return areIntervalsOverlapping(
    { start: e1StartDate, end: e1EndDate },
    { start: e2StartDate, end: e2EndDate },
    { inclusive: true }
  )
}

/* Compute the exercise tracks for the exercises of each module */
export function computeTracks(exercises: Exercise[], term: Term): Track[] {
  /* Pre: Ordering input by the start date */
  const orderedExercises = exercises
    .filter((e) => e.deadline > term.start && e.startDate < term.end)
    .sort((e1, e2) => Number(e1.startDate) - Number(e2.startDate))
  const tracks: Track[] = []
  /* The 'of' is used instead of 'in' to enforce the type of exercise */
  for (const exercise of orderedExercises) {
    let exerciseAssignedToTrack = false
    /* Try to fit the given exercise into one of the tracks */
    for (const track of tracks) {
      if (track.every((trackExercise) => !exercisesOverlap(exercise, trackExercise))) {
        exerciseAssignedToTrack = true
        track.push(exercise)
        break
      }
    }
    /* Create a new track if none of the previous tracks can accommodate the exercise */
    if (!exerciseAssignedToTrack) tracks.push([exercise])
  }
  return tracks
}

export function padForModulesWithNoExercises(moduleCodes: string[], trackMap: TrackMap): TrackMap {
  const uniqueModuleCodes = moduleCodes
    .concat(Object.keys(trackMap))
    .filter((v, i, a) => a.indexOf(v) === i)
  return uniqueModuleCodes.reduce((accumulator: TrackMap, code: string) => {
    accumulator[code] = trackMap?.[code] ?? []
    return accumulator
  }, {})
}

/* Creates a track map given a list of modules with exercises */
export function generateTrackMap(exercises: { [code: string]: Exercise[] }, term: Term): TrackMap {
  return Object.entries(exercises).reduce((accumulator: TrackMap, [code, exercises]) => {
    accumulator[code] = computeTracks(exercises, term)
    return accumulator
  }, {})
}

/* Formats a date range as "D-D MMM or D MMM-D MMM" */
export const formatDateRange = (start: Date, end: Date): string =>
  format(start, 'd' + (isSameMonth(start, end) ? '' : ' MMM')) + format(end, '-d MMM')

export const displayTimestamp = (date: Date, format?: string): string =>
  formatInTimeZone(
    date,
    LONDON_TIMEZONE,
    format || "EEEE, d LLL 'by' " + (getMinutes(date) ? 'h:mmaaa' : 'h aaa')
  )

export const calculateGrade = (mark: number, maximumMark: number): string => {
  if (isNaN(mark) || isNaN(maximumMark) || maximumMark === 0) return ''
  const percentageGrade = (100 * mark) / maximumMark
  if (percentageGrade < 30) return 'F'
  if (percentageGrade < 40) return 'E'
  if (percentageGrade < 50) return 'D'
  if (percentageGrade < 60) return 'C'
  if (percentageGrade < 70) return 'B'
  if (percentageGrade < 80) return 'A'
  return 'A*'
}

// rounds percentage down to nearest 1 %
export const percentage = (mark: number, maximumMark: number): string => {
  if (isNaN(mark) || isNaN(maximumMark) || maximumMark === 0) return ''
  return `${Math.floor((100 * mark) / maximumMark)}%`
}

export const capitaliseFirstLetter = (str?: string): string =>
  str ? str[0].toUpperCase() + str.slice(1) : ''

/* Concatenate grouped arrays */
export function concatGrouped<T>(
  a: { [key: string]: T[] },
  b: { [key: string]: T[] }
): { [key: string]: T[] } {
  return Object.entries(a).reduce(
    (acc, [group, values]) => {
      if (acc[group]) {
        acc[group] = acc[group].concat(values)
      } else {
        acc[group] = values
      }
      return acc
    },
    /* A shallow copy is sufficient as we do not mutate the arrays */
    { ...b }
  )
}

/* inclusive lower, exclusive upper */
export function range(lower: number, upper: number): number[] {
  return Array.from({ length: upper - lower }, (_, i) => lower + i)
}

/**
 * Extract the file extension from its path
 * @param path a string representing the file path e.g. `path/to/file.pdf`
 * @returns the file extension e.g. `.pdf`
 */
export const getFileExtension = (path: string) => {
  const extension = path.slice(((path.lastIndexOf('.') - 1) >>> 0) + 2)
  return extension ? `.${extension}` : ''
}

export function getCookie(cookieName: string): string {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${cookieName}=`)
  return parts.length === 2 ? parts.pop()?.split(';').shift() || '' : ''
}

export function toPlainSelectOption(value: string) {
  return { value: value, label: value }
}

export function encodeURL(url: string): string {
  const replacementMappings: { [k: string]: string } = {
    '+': '%2B',
  }
  return url.replace(/\+/g, (m) => replacementMappings[m])
}

export function removeDuplicates<T extends string | number | boolean>(arr: T[]) {
  return Array.from(new Set(arr))
}

/* Assume string is non-empty */
export function capitalizeEachWord(sentence: string): string {
  return sentence.split(' ').map(capitalizeFirstLetter).join(' ')
}

/* Assume string is non-empty */
function capitalizeFirstLetter(word: string): string {
  return word[0].toLocaleUpperCase() + word.slice(1)
}
