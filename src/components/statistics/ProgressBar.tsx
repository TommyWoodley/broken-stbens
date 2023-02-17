import { Progress, ProgressIndicator } from '../../styles/statistics/ProgressBar.style'

export const ProgressBar = ({ progress }: { progress: number }) => (
  <Progress>
    <ProgressIndicator css={{ transform: `translateX(-${100 - progress}%)` }} />
  </Progress>
)
