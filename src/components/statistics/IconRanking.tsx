import { IconRankingValue } from '../../styles/statistics/IconRanking.style'
import { IconList } from './IconList'
import { NumberedIcon } from './numberedIcons'

export type IconRankingItem = {
  label: string
  value: number
}

/* List of item labels enumerate with numered icons. Requires items to be in descending order */
export const IconRanking = ({
  NumberedIcon,
  items,
  showValue = true,
  valueFormatter = (value: number) => `${value}`,
  iconSize = 24,
}: {
  NumberedIcon: NumberedIcon
  items: IconRankingItem[]
  showValue?: boolean
  valueFormatter?: (value: number) => string
  iconSize?: number
}) => {
  const iconGenerator = (index: number) => <NumberedIcon size={iconSize} value={index + 1} />
  const keyGenerator = (item: IconRankingItem) => item.label
  const contentGenerator = (item: IconRankingItem) => (
    <>
      <span style={{ flexGrow: 1 }}>{item.label}</span>
      {showValue && <IconRankingValue>{valueFormatter(item.value)}</IconRankingValue>}
    </>
  )
  return (
    <IconList
      iconGenerator={iconGenerator}
      items={items}
      contentGenerator={contentGenerator}
      keyGenerator={keyGenerator}
    />
  )
}
