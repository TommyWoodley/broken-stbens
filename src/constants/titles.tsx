import { capitaliseFirstLetter, formatShortYear, shortYear } from '../lib/utilities.service'
import { Exercise } from '../types/schemas/abc'

// Scientia's meta titles

// All titles start with the academic year if not current,
const addYear = (year?: string) => (year !== shortYear() ? formatShortYear(year) + ':' : '')
// All titles end with " | St Benedicts"
const STBENS = '| St Benedict\'s'

const titles = {
  login: ['Log in', STBENS].join(' '),

  modules: (year?: string, cohortName?: string) =>
    [addYear(year), 'Modules', cohortName ? `• ${cohortName}` : '', STBENS].join(' '),

  module: (year?: string, moduleCode?: string | null, moduleTitle?: string) =>
    [addYear(year), moduleCode ?? 'Module', moduleTitle, STBENS].join(' '),

  exercises: (year?: string, moduleCode?: string | null, moduleTitle?: string) =>
    [addYear(year), 'Exercises •', moduleCode ?? 'Module', moduleTitle, STBENS].join(' '),

  exercise: (year?: string, exercise?: Exercise, moduleCode?: string, exerciseNumber?: string) =>
    [
      addYear(year),
      exercise?.type,
      exercise ? `${exerciseNumber}:` : `Exercise ${exerciseNumber}`,
      exercise?.title,
      '•',
      exercise?.moduleName ?? moduleCode,
      STBENS,
    ].join(' '),

  timeline: (year?: string, term?: string, cohortName?: string) =>
    [
      addYear(year),
      term ? capitaliseFirstLetter(term) : 'Timeline',
      cohortName ? `• ${cohortName}` : '',
      STBENS,
    ].join(' '),
}

export default titles
