import { Toggle as TogglePrimitive } from '@radix-ui/react-toggle'
import { Toolbar as ToolbarPrimitive } from '@radix-ui/react-toolbar'

import { styled } from './stitches.config'

export const ToolbarContainer = styled(ToolbarPrimitive, {
  display: 'flex',
  width: '100%',
  minWidth: 'max-content',
})

export const itemStyles = {
  flex: '0 0 auto',
  height: '2.75rem',
  borderRadius: '0.5rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const Toggle = styled(TogglePrimitive, {
  ...itemStyles,
  fontSize: '$md',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  padding: '0 1rem 0 1rem',
  borderRadius: '0.5rem',
  backgroundColor: '$elementHover',
  '&[data-state=on]': {
    backgroundColor: '$elementActive',
  },
  '&:hover': {
    backgroundColor: '$elementActive',
  },
})
