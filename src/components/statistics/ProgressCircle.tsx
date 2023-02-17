import { useEffect, useState } from 'react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'

import { progressCircleStyle } from '../../styles/statistics/ProgressCircle.style'

export const ProgressCircle = ({
  numerator,
  denominator,
  textFormatter,
}: {
  numerator: number
  denominator: number
  textFormatter: (numerator: number) => string
}) => {
  const [circleProgress, setCircleProgress] = useState(0)

  const percentageProgress = denominator === 0 ? 0 : Math.round((100 * numerator) / denominator)

  useEffect(() => {
    setTimeout(() => setCircleProgress(percentageProgress), 1000)
  }, [percentageProgress])

  return (
    <CircularProgressbarWithChildren styles={progressCircleStyle} value={circleProgress}>
      <span style={{ textAlign: 'center', width: '40%', fontSize: '1.5rem' }}>
        {textFormatter(numerator)}
      </span>
    </CircularProgressbarWithChildren>
  )
}
