import { plainToInstance } from 'class-transformer'

import {
  computeTracks,
  exercisesOverlap,
  generateTrackMap,
  padForModulesWithNoExercises,
} from '../lib/utilities.service'
import { Exercise, Term } from '../types/schemas/abc'
import { Track, TrackMap } from '../types/timeline'

const EXERCISE_TEMPLATE = {
  number: 1,
  title: 'Task 1',
  type: 'CW',
  owner: 'rbc',
  estimated_work_hours: 6,
  submission_type: 'individual',
  start_date: new Date(2022, 9, 11, 9),
  end_date: new Date(2022, 9, 29, 19),
  module_code: '40001',
  module_name: 'Lab 2',
  mark: null,
  extended_end_date: null,
  maximum_mark: 100,
}

const TERM: Term = {
  start: new Date(2022, 8, 29),
  end: new Date(2022, 11, 25),
  name: 'autumn term',
  weeks: 11,
}

const reference = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  start_date: new Date(2022, 9, 1),
  end_date: new Date(2022, 9, 10),
})
const overlapping = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  start_date: new Date(2022, 9, 5),
  end_date: new Date(2022, 9, 15),
})
const preceding = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  start_date: new Date(2022, 8, 25),
  end_date: new Date(2022, 8, 30),
})
const following = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  start_date: new Date(2022, 9, 11),
  end_date: new Date(2022, 9, 15),
})

test.each([
  [reference, overlapping, true],
  [reference, preceding, false],
  [reference, following, false],
])('can identify overlapping exercises', (exercise1, exercise2, expected) => {
  expect(exercisesOverlap(exercise1, exercise2)).toBe(expected)
})

test('computes the right tracks for set of exercise', () => {
  const actual = computeTracks([preceding, overlapping, reference, following], TERM)
  const expected: Track[] = [[preceding, reference, following], [overlapping]]
  expect(actual).toEqual(expected)
})

const inputModules: { [code: string]: Exercise[] } = {
  '50007.1': [
    {
      ...EXERCISE_TEMPLATE,
      title: 'Pintos Task 1',
      start_date: new Date(Date.UTC(2022, 9, 11, 12)),
      end_date: new Date(Date.UTC(2022, 9, 29, 19)),
    },
    {
      ...EXERCISE_TEMPLATE,
      title: 'Pintos Task 2',
      start_date: new Date(Date.UTC(2022, 10, 1, 12)),
      end_date: new Date(Date.UTC(2022, 10, 19, 19)),
    },
  ].map((e) => plainToInstance(Exercise, e)),
  '50002': [
    {
      ...EXERCISE_TEMPLATE,
      title: 'TDD',
      start_date: new Date(Date.UTC(2022, 9, 11, 12)),
      end_date: new Date(Date.UTC(2022, 9, 29, 19)),
    },
    {
      ...EXERCISE_TEMPLATE,
      title: 'Mockery',
      start_date: new Date(Date.UTC(2022, 9, 28, 12)),
      end_date: new Date(Date.UTC(2022, 10, 5, 19)),
    },
  ].map((e) => plainToInstance(Exercise, e)),
}

test('computes the right track map for set of modules', () => {
  const expected: TrackMap = {
    '50007.1': [
      [
        {
          ...EXERCISE_TEMPLATE,
          title: 'Pintos Task 1',
          start_date: new Date(Date.UTC(2022, 9, 11, 12)),
          end_date: new Date(Date.UTC(2022, 9, 29, 19)),
        },
        {
          ...EXERCISE_TEMPLATE,
          title: 'Pintos Task 2',
          start_date: new Date(Date.UTC(2022, 10, 1, 12)),
          end_date: new Date(Date.UTC(2022, 10, 19, 19)),
        },
      ].map((e) => plainToInstance(Exercise, e)),
    ],
    '50002': [
      [
        {
          ...EXERCISE_TEMPLATE,
          title: 'TDD',
          start_date: new Date(Date.UTC(2022, 9, 11, 12)),
          end_date: new Date(Date.UTC(2022, 9, 29, 19)),
        },
      ].map((e) => plainToInstance(Exercise, e)),
      [
        {
          ...EXERCISE_TEMPLATE,
          title: 'Mockery',
          start_date: new Date(Date.UTC(2022, 9, 28, 12)),
          end_date: new Date(Date.UTC(2022, 10, 5, 19)),
        },
      ].map((e) => plainToInstance(Exercise, e)),
    ],
  }
  let actual = generateTrackMap(inputModules, TERM)
  expect(actual).toEqual(expected)
})

const insideTerm = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  start_date: new Date(2022, 9, 10),
  end_date: new Date(2022, 9, 15),
})
const acrossTerm = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  start_date: new Date(2022, 11, 20),
  end_date: new Date(2023, 0, 5),
})
const outsideTerm = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  start_date: new Date(2023, 1, 25),
  end_date: new Date(2023, 1, 30),
})

test('excludes exercises outside of term', () => {
  const expected: Track[] = [[insideTerm, acrossTerm]]
  const actual = computeTracks([insideTerm, outsideTerm, acrossTerm], TERM)
  expect(actual).toEqual(expected)
})

const exerciseWithoutExtension = plainToInstance(Exercise, EXERCISE_TEMPLATE)
const exerciseWithExtension = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  extended_end_date: new Date(2023, 9, 10),
})

test.each`
  nameSuffix                                    | exercise                    | expectedDeadline
  ${'existing extended end-date'}               | ${exerciseWithExtension}    | ${exerciseWithExtension.extendedEndDate}
  ${'end-date because no extension is present'} | ${exerciseWithoutExtension} | ${exerciseWithExtension.endDate}
`('deadline property matches $nameSuffix', ({ _, exercise, expectedDeadline }) => {
  expect(exercise.deadline).toEqual(expectedDeadline)
})

test('padForModulesWithNoExercises adds empty tracks for modules without exercises in track map', () => {
  const modulesForTerm = ['40001', '40002']
  const trackMap = { '40002': [[plainToInstance(Exercise, EXERCISE_TEMPLATE)]] }
  expect(padForModulesWithNoExercises(modulesForTerm, trackMap)).toEqual({
    '40001': [],
    '40002': [[plainToInstance(Exercise, EXERCISE_TEMPLATE)]],
  })
})
