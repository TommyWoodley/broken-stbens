import { capitaliseFirstLetter, formatShortYear, shortYear } from '../lib/utilities.service'
import { Exercise } from '../types/schemas/abc'

// Scientia's meta titles

// All titles start with the academic year if not current,
const addYear = (year?: string) => (year !== shortYear() ? formatShortYear(year) + ':' : '')
// All titles end with " | Scientia"
const SCIENTIA = '| Scientia'

const titles = {
  login: ['Log in', SCIENTIA].join(' '),

  modules: (year?: string, cohortName?: string) =>
    [addYear(year), 'Modules', cohortName ? `• ${cohortName}` : '', SCIENTIA].join(' '),

  module: (year?: string, moduleCode?: string | null, moduleTitle?: string) =>
    [addYear(year), moduleCode ?? 'Module', moduleTitle, SCIENTIA].join(' '),

  exercises: (year?: string, moduleCode?: string | null, moduleTitle?: string) =>
    [addYear(year), 'Exercises •', moduleCode ?? 'Module', moduleTitle, SCIENTIA].join(' '),

  exercise: (year?: string, exercise?: Exercise, moduleCode?: string, exerciseNumber?: string) =>
    [
      addYear(year),
      exercise?.type,
      exercise ? `${exerciseNumber}:` : `Exercise ${exerciseNumber}`,
      exercise?.title,
      '•',
      exercise?.moduleName ?? moduleCode,
      SCIENTIA,
    ].join(' '),

  timeline: (year?: string, term?: string, cohortName?: string) =>
    [
      addYear(year),
      term ? capitaliseFirstLetter(term) : 'Timeline',
      cohortName ? `• ${cohortName}` : '',
      SCIENTIA,
    ].join(' '),
}

export default titles
