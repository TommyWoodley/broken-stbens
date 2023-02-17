import {
  Label,
  Legend,
  Line,
  LineChart as LineChartPrimitive,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import { removeDuplicates } from '../../lib/utilities.service'
import { theme } from '../../styles/stitches.config'

const LINE_COLORS: string[] = [
  theme.colors.blue9,
  theme.colors.amber9,
  theme.colors.green9,
  theme.colors.red9,
  theme.colors.cyan9,
].map((color) => color.toString())

export type LineChartDataPoint = {
  xValue: number
  lines: { lineLabel: string; yValue: number }[]
}

/* The number of data points is limited by the number of available colours */
/* Any line entry missing from a data point is zeroed */
export const LineChart = ({
  dataPoints,
  yLabel,
  xValueFormatter,
  ticks,
  dataMax,
}: {
  dataPoints: LineChartDataPoint[]
  yLabel: string
  xValueFormatter: (xValue: number) => string
  ticks: number[]
  dataMax?: number
}) => {
  const domain = dataMax ? [0, dataMax] : undefined
  const lineLabels = removeDuplicates(
    dataPoints
      .slice(0, LINE_COLORS.length)
      .map((dataPoint) => dataPoint.lines.map(({ lineLabel }) => lineLabel))
      .flat()
  )

  /* Add 0 value for any missing line entries */
  const defaultLineValues = lineLabels.map((lineLabel) => ({ lineLabel, yValue: 0 }))
  const completeDataPoints = dataPoints.map((dataPoint) => ({
    xValue: dataPoint.xValue,
    data: [...defaultLineValues, ...dataPoint.lines],
  }))

  const flatData = completeDataPoints.map((dataPoint) =>
    dataPoint.data.reduce(
      (acc, { lineLabel, yValue }) =>
        Object.assign(acc, { xValue: dataPoint.xValue, [lineLabel]: yValue }),
      {}
    )
  )

  return (
    <ResponsiveContainer width="100%" aspect={16 / 9}>
      <LineChartPrimitive margin={{ right: 30 }} data={flatData}>
        <XAxis
          style={{ fill: `${theme.colors.highContrast}` }}
          axisLine={{ stroke: `${theme.colors.highContrast}` }}
          dataKey="xValue"
          type="number"
          domain={domain}
          ticks={ticks}
          tickFormatter={xValueFormatter}
        />
        <YAxis style={{ stroke: `${theme.colors.highContrast}` }} tick={false}>
          <Label style={{ fill: `${theme.colors.highContrast}` }} angle={-90} value={yLabel} />
        </YAxis>
        <Legend />
        {lineLabels.map((lineLabel, index) => (
          <Line
            key={lineLabel}
            type="monotone"
            dataKey={lineLabel}
            stroke={LINE_COLORS[index]}
            strokeWidth={1.5}
            dot={false}
          />
        ))}
      </LineChartPrimitive>
    </ResponsiveContainer>
  )
}
