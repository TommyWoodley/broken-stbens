import { isWeekend } from 'date-fns'
import { useEffect, useRef } from 'react'

import { now } from '../../lib/utilities.service'
import { dateToColumn } from '../../pages/Timeline'
import { Term } from '../../types/schemas/abc'
import { css, styled } from '../stitches.config'

export const Grid = styled('div', {
  display: 'grid',
  paddingTop: '0.5rem',
  paddingBottom: '1rem',
  gridArea: 'background',
  zIndex: 3,
})

export const VerticalDayLine = ({ term }: { term: Term }) => {
  const fieldRef = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    fieldRef.current?.scrollIntoView({ inline: 'center' })
  }, [term])

  return term.start <= now() && now() <= term.end ? (
    <div
      ref={fieldRef}
      className={css({
        borderLeft: '2px solid $primary9',
        marginLeft: `calc(${isWeekend(now()) ? '0.25rem' : '1.5rem'} - 2px)`,
        display: 'flex',
        width: 2,
        gridColumn: dateToColumn(now(), term.start),
        gridRow: `1 / -1`,
      })()}
    ></div>
  ) : null
}
