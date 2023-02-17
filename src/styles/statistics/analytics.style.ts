import { styled } from '../stitches.config'

export const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
})

export const List = styled('div', {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '> div:not(:last-of-type)': { borderBottom: '0.1rem solid $separator' },
})
