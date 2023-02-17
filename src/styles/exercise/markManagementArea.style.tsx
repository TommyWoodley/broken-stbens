import { styled } from '../stitches.config'

export const MainContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '1rem',
  border: '0.025rem solid $sand8',
  borderRadius: '0.5rem',
  padding: '2rem',
})

export const InnerContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
})

export const DropzoneContainer = styled('div', {
  backgroundColour: '$sand8',
  '&:hover': {
    backgroundColor: '$sand6',
  },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2.5rem',
  cursor: 'pointer',
  border: '0.05rem dashed $sand6',
})
