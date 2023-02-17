import { ToggleGroupItem, ToggleGroup as ToggleGroupPrimitive } from '@radix-ui/react-toggle-group'

import { styled } from '../stitches.config'
import { itemStyles } from '../toolbar.style'

/* Both group and item have no styling connections with the timeline and can be extracted to _app.style if needed */
export const Group = styled(ToggleGroupPrimitive, {
  display: 'flex',
  borderRadius: '0.25rem',
})

export const Item = styled(ToggleGroupItem, {
  ...itemStyles,
  width: '2.75rem',
  height: '2.75rem',
  background: 'none',
  '&[data-state=on]': {
    backgroundColor: '$elementActive',
  },
})

export const TermSwitchArrow = styled('button', {
  width: '2.25rem',
  height: '2.25rem',
  display: 'flex',
  marginTop: 0,
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
  backgroundColor: '$appBackground',
  border: '1px solid $elementBorder',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  variants: {
    disabled: {
      true: {
        visibility: 'hidden',
      },
    },
  },
  '&:hover': {
    backgroundColor: '$neutral3',
  },
})
