import { addWeeks } from 'date-fns'

import { Wrapper } from '../../styles/_app.style'
import { Week } from './Week'

export const Weeks = ({ start, weeks }: { start: Date; weeks: number }) => (
  <Wrapper
    css={{
      gridArea: 'weeks',

      display: 'grid',
      gridAutoFlow: 'row',
      gridTemplateColumns: `repeat(${weeks}, 15rem)`,
      gridGap: '0.5rem',

      position: 'sticky',
      top: '0',

      paddingRight: '1rem',
      paddingTop: '1rem',

      zIndex: '4',
      backgroundColor: '$appBackground',
    }}
  >
    {[...Array(weeks)].map((_, week) => (
      <Week key={week} start={addWeeks(start, week)} week={week} />
    ))}
  </Wrapper>
)
