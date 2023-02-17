import { TIMELINE_TRACK_HEIGHT } from '../../constants/global'
import { Exercise } from '../../types/schemas/abc'
import { styleExerciseItem } from '../exerciseItem.style'
import { styled } from '../stitches.config'

export const TrackItemTitle = styled('div', {
  fontSize: '1rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

export const trackItemStyles = ({
  exercise,
  startColumn,
  endColumn,
  row,
}: {
  exercise: Exercise
  startColumn: number
  endColumn: number
  row: number
}) => {
  const isSingleDay = endColumn - startColumn < 2
  return {
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    height: TIMELINE_TRACK_HEIGHT,
    margin: 'auto 0',

    gridColumn: `${startColumn} / ${endColumn}`,
    gridRow: `${row + 1}`, // Grid is 1-indexed
    justifyContent: isSingleDay ? 'center' : 'space-between',
    padding: isSingleDay ? '0.25rem' : '0.5rem',
    textAlign: isSingleDay ? 'center' : 'left',
    ...styleExerciseItem(exercise),
  }
}
