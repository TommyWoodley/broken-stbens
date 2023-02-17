import { Arrow, Content } from '@radix-ui/react-popover'

import { styled } from './stitches.config'

export const PopoverContent = styled(Content, {
  border: '2px solid $sand11',
  outline: 'none',
  backgroundColor: '$sand2',
  zIndex: 11,
  boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
  padding: '1rem',
})

export const PopoverArrow = styled(Arrow, {
  fill: '$sand11',
})

export const DeleteButton = styled('button', {
  width: 'fit-content',
  alignItems: 'center',
  padding: '0.25rem',
  svg: { fill: '$sand9' },
  borderRadius: '4px',
  display: 'inline-flex',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: '$sand1',
  '&:hover': {
    backgroundColor: '$sand2',
    svg: { fill: '$sand12' },
  },
})
