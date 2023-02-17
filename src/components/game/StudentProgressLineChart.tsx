import { differenceInDays, nextMonday } from 'date-fns'

import { now } from '../../lib/utilities.service'
import { DatedModuleMeanCompletions } from '../../types/schemas/gamification'
import { LineChart, LineChartDataPoint } from '../statistics/LineChart'

/* Recent completion must be sorted by date */
export const StudentProgressLineChart = ({
  termStart,
  recentCompletions,
}: {
  termStart: Date
  recentCompletions: DatedModuleMeanCompletions[]
}) => {
  if (recentCompletions.length === 0) {
    return <></>
  }

  /* Date of the first recent completion (Assumes data points are ordered by date) */
  const startDate = recentCompletions[0].date
  const dataPoints = recentCompletions.map(getRecentCompletionToLineChartDataPoint(startDate))

  const totalDays = differenceInDays(now(), startDate)
  const firstMondayOffset = differenceInDays(nextMonday(startDate), startDate) % 7
  const lastMondayOffset = totalDays - firstMondayOffset
  const ticks = Array.from(
    Array(Math.floor(lastMondayOffset / 7) + 1).keys(),
    (n: number) => n * 7 + firstMondayOffset
  )

  /* Calulates the term week from the start date */
  const offsetToWeek = (offset: number) =>
    `Week ${Math.floor((offset + differenceInDays(startDate, termStart)) / 7 + 1)}`

  return (
    <LineChart
      dataPoints={dataPoints}
      yLabel="Student Progress"
      xValueFormatter={offsetToWeek}
      ticks={ticks}
      dataMax={totalDays}
    />
  )
}

function getRecentCompletionToLineChartDataPoint(
  startDate: Date
): (_: DatedModuleMeanCompletions) => LineChartDataPoint {
  return ({ date, moduleMeanCompletions: moduleCompletions }) => ({
    xValue: differenceInDays(date, startDate),
    lines: moduleCompletions.map(({ title, meanCompletion }) => ({
      lineLabel: title,
      yValue: meanCompletion,
    })),
  })
}
