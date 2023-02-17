import { styled } from '../stitches.config'

export const Grid = styled('div', {
  gridArea: 'background',
  display: 'grid',
  gridTemplateRows: 'auto',
  rowGap: 0,
  columnGap: '0.5rem',
  zIndex: 1,
})
