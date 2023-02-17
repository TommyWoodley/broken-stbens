import { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { format as formatTimeAgo } from 'timeago.js'

import { now } from '../../lib/utilities.service'
import { css } from '../../styles/stitches.config'
import { TrackItemTitle, trackItemStyles } from '../../styles/timeline/track-item.style'
import { Exercise } from '../../types/schemas/abc'

export const TrackItem = (props: {
  exercise: Exercise
  startColumn: number
  endColumn: number
  row: number
}) => {
  const { exercise, startColumn, endColumn } = props
  const { year } = useParams()

  const AnchorWrapper = ({ children }: { children: ReactNode }) => {
    const title = `${exercise.type}: ${exercise.title} - due ${formatTimeAgo(exercise.deadline)}`
    const style = { className: css(trackItemStyles(props))() }

    return exercise.startDate <= now() ? (
      <a
        href={`/${year}/modules/${exercise.moduleCode}/exercises/${exercise.number}`}
        title={title}
        {...style}
      >
        {children}
      </a>
    ) : (
      <div title={title} {...style}>
        {children}
      </div>
    )
  }

  const isSingleDay = endColumn - startColumn < 2
  return (
    <AnchorWrapper>
      <TrackItemTitle>
        {isSingleDay ? (
          <span style={{ fontWeight: 500 }}>{exercise.number}</span>
        ) : (
          <>
            <span style={{ fontWeight: 500 }}>
              {exercise.type} {exercise.number}:
            </span>
            &nbsp;{exercise.title}
            {exercise.estimatedWorkHours ? (
              <div
                className={css({
                  display: 'flex',
                  flexWrap: 'wrap',
                  columnGap: '0.5rem',
                  fontSize: '0.9rem',
                  color: '$lowContrast',
                })()}
              >
                Estimate: {exercise.estimatedWorkHours}h
              </div>
            ) : (
              ''
            )}
          </>
        )}
      </TrackItemTitle>
    </AnchorWrapper>
  )
}
