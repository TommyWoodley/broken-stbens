import { eachDayOfInterval, format, isToday, nextFriday, nextSaturday } from 'date-fns'

import { formatDateRange, now } from '../../lib/utilities.service'
import { css } from '../../styles/stitches.config'
import { Day, Header } from '../../styles/timeline/week.style'

export const Week = ({ start, week }: { start: Date; week: number }) => {
  const weekdays = eachDayOfInterval({ start, end: nextFriday(start) })

  return (
    <div style={{ width: '15rem', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
      <Header active={start <= now() && now() < nextSaturday(start)}>
        <span>Week {week + 1}</span>
        <span className={css({ color: '$lowContrast' })()}>
          {formatDateRange(start, nextFriday(start))}
        </span>
      </Header>
      <div style={{ display: 'flex' }}>
        {weekdays.map((day, i) => (
          <Day key={i} active={isToday(day)}>
            {format(day, 'ccc')}
          </Day>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        {weekdays.map((day, i) => (
          <Day
            key={i}
            active={isToday(day)}
            className={css({ color: '$neutral8', fontSize: '$sm' })()}
          >
            {day.getDate()}
          </Day>
        ))}
      </div>
    </div>
  )
}
