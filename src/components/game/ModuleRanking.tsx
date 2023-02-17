import { ModuleMeanCompletion } from '../../types/schemas/gamification'
import { IconRanking, IconRankingItem } from '../statistics/IconRanking'
import { NumberedIcon } from '../statistics/numberedIcons'

/* List of modules enumerated with numered icons */
export const ModuleRanking = ({
  NumberedIcon,
  moduleCompletions,
  iconSize = 24,
  showCompletion = false,
}: {
  NumberedIcon: NumberedIcon
  moduleCompletions: ModuleMeanCompletion[]
  iconSize?: number
  showCompletion?: boolean
}) => {
  return (
    <IconRanking
      NumberedIcon={NumberedIcon}
      items={moduleCompletions.map(moduleCompletionToIconRankingItem)}
      iconSize={iconSize}
      showValue={showCompletion}
      valueFormatter={(value: number) => `${value}%`}
    />
  )
}

function moduleCompletionToIconRankingItem(
  moduleCompletion: ModuleMeanCompletion
): IconRankingItem {
  return {
    label: moduleCompletion.title,
    value: moduleCompletion.meanCompletion,
  }
}
