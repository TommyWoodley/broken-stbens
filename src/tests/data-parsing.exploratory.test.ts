import { plainToInstance } from 'class-transformer'

import { Exercise } from '../types/schemas/abc'

test('can parse Date correctly from string', () => {
  const rawExercise = {
    number: 4,
    title: 'Pintos Task 1 - Scheduling',
    type: 'CW',
    start_date: '2021-10-11T12:00:00Z',
    end_date: '2021-10-29T19:00:00Z',
    submission_type: 'group',
  }
  const expectedExercise = {
    number: 4,
    title: 'Pintos Task 1 - Scheduling',
    type: 'CW',
    startDate: new Date(Date.UTC(2021, 9, 11, 12)),
    endDate: new Date(Date.UTC(2021, 9, 29, 19)),
    submissionType: 'group',
  }

  let actual = plainToInstance(Exercise, rawExercise)
  expect(actual).toEqual(expectedExercise)
})
