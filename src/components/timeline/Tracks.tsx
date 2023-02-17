import { max, min } from 'date-fns'

import { DIVIDER_HEIGHT, TIMELINE_TRACK_HEIGHT } from '../../constants/global'
import { dateToColumn } from '../../pages/Timeline'
import { WEEKDAYS_WIDTHS, WEEKEND_WIDTH } from '../../styles/timeline/constants.style'
import { Grid, VerticalDayLine } from '../../styles/timeline/tracks.style'
import { Exercise, Term } from '../../types/schemas/abc'
import { Track, TrackMap } from '../../types/timeline'
import { TrackItem } from './TrackItem'

export const Tracks = ({
  term,
  trackMap,
  weeks,
}: {
  term: Term
  trackMap: TrackMap
  weeks: number
}) => {
  // Ad hoc calculation of grid-template-rows heights to align to the hardcoded padding of the Module tabs

  const gridTemplateRows = Object.keys(trackMap)
    .sort()
    .map((code) => {
      const tracks = trackMap[code]
      return tracks.length > 0
        ? tracks
            .map((_, i) => {
              if (tracks.length === 1)
                return `calc(${TIMELINE_TRACK_HEIGHT} + 0.75rem * 2 + ${DIVIDER_HEIGHT})`
              if (i === 0) return `calc(${TIMELINE_TRACK_HEIGHT} + 0.75rem)`
              if (tracks.length === i + 1)
                return `calc(${TIMELINE_TRACK_HEIGHT} + 0.75rem + ${DIVIDER_HEIGHT})`
              return `calc(${TIMELINE_TRACK_HEIGHT})`
            })
            .join(' ')
        : `calc(${TIMELINE_TRACK_HEIGHT} + 0.75rem * 2 + ${DIVIDER_HEIGHT})`
    })
    .join(' ')

  // Flatten the ordered trackMap and display each exercise block on the right row.
  return (
    <Grid
      css={{
        gridTemplateColumns: `repeat(${weeks}, ${WEEKDAYS_WIDTHS} ${WEEKEND_WIDTH})`,
        gridTemplateRows: gridTemplateRows,
        alignItems: 'stretch',
      }}
    >
      <VerticalDayLine term={term} />
      {Object.keys(trackMap)
        .sort()
        // Using [null] as a placeholder to keep the positioning
        // of tracks consistent in cases of modules with no exercises.
        .map((code) => (trackMap[code].length ? trackMap[code] : [null]))
        .flat()
        .map(
          (track: Track | null, rowIndex) =>
            track &&
            track
              .filter(Boolean)
              .filter(
                (exercise: Exercise) =>
                  exercise.startDate >= term.start ||
                  (term.start <= exercise.deadline && exercise.deadline <= term.end)
              )
              .map((exercise: Exercise) => (
                <TrackItem
                  key={`${rowIndex}-${exercise.number}`}
                  exercise={exercise}
                  startColumn={dateToColumn(max([exercise.startDate, term.start]), term.start)}
                  endColumn={dateToColumn(min([exercise.deadline, term.end]), term.start) + 1}
                  row={rowIndex}
                />
              ))
        )}
    </Grid>
  )
}
