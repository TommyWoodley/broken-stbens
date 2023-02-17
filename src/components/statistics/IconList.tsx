import { Wrapper } from '../../styles/_app.style'
import { List } from '../../styles/statistics/analytics.style'

export const IconList = <T,>({
  items,
  iconGenerator,
  keyGenerator,
  contentGenerator,
}: {
  items: T[]
  iconGenerator: (index: number) => React.ReactNode
  keyGenerator: (item: T) => React.Key
  contentGenerator: (item: T) => React.ReactNode
}) => {
  return (
    <List css={{ width: '100%' }}>
      {items.map((item, index) => (
        <Wrapper css={{ minHeight: '3.7rem' }} key={keyGenerator(item)} inline>
          {iconGenerator(index)}
          {contentGenerator(item)}
        </Wrapper>
      ))}
    </List>
  )
}
