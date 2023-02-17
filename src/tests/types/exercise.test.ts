import { plainToInstance } from 'class-transformer'
import { addDays } from 'date-fns'

import { GRACE_PERIOD_AFTER_DEADLINE_IN_DAYS } from '../../constants/global'
import { Exercise } from '../../types/schemas/abc'

const DEADLINE = new Date(2022, 9, 29, 19)
const EXTENDED_DEADLINE = new Date(2022, 10, 2, 19)
const EXERCISE_TEMPLATE = {
  number: 1,
  title: 'Task 1',
  type: 'CW',
  owner: 'rbc',
  estimated_work_hours: 6,
  submission_type: 'individual',
  start_date: new Date(2022, 9, 11, 9),
  end_date: DEADLINE,
  module_code: '40001',
  module_name: 'Lab 2',
  mark: null,
  extended_end_date: null,
  maximum_mark: 100,
}

const exerciseWithoutExtension = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  title: 'exercise without extension',
})

const exerciseWithExtension = plainToInstance(Exercise, {
  ...EXERCISE_TEMPLATE,
  extended_end_date: EXTENDED_DEADLINE,
  title: 'exercise with extension',
})

describe('Exercise', () => {
  it.each`
    exercise                    | expected
    ${exerciseWithoutExtension} | ${DEADLINE}
    ${exerciseWithExtension}    | ${EXTENDED_DEADLINE}
  `(`exposes deadline for $exercise.title`, ({ exercise, expected }) => {
    expect(exercise.deadline).toEqual(expected)
  })

  it(`exposes late period deadline as formal deadline + ${GRACE_PERIOD_AFTER_DEADLINE_IN_DAYS} days`, () => {
    expect(exerciseWithoutExtension.latePeriodDeadline).toEqual(
      addDays(DEADLINE, GRACE_PERIOD_AFTER_DEADLINE_IN_DAYS)
    )
  })
})
