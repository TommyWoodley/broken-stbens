import { Link } from 'react-router-dom'

import { styled } from './stitches.config'

export const TabsWrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '2rem',
})

export const Tab = styled(Link, {
  padding: '0.75rem',
  color: '$highContrast',
  display: 'flex',
  position: 'relative',
  cursor: 'pointer',
  justifyContent: 'space-between',
  borderRadius: '0.5rem',
  '&:hover': {
    backgroundColor: '$neutral3',
  },
})
