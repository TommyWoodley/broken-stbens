import { AccordionContent, AccordionHeader, AccordionTrigger } from '@radix-ui/react-accordion'
import { keyframes } from '@stitches/react'
import { CaretRightFill } from 'react-bootstrap-icons'

import { styled } from './stitches.config'

export const Header = styled(AccordionHeader, {
  all: 'unset',
  boxSizing: 'border-box',
  /* The header aligns the trigger and collection checkbox */
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
})

/* TODO: Make the trigger height and style user-configurable */
export const Trigger = styled(AccordionTrigger, {
  boxSizing: 'border-box',
  userSelect: 'none',
  cursor: 'pointer',
  fontSize: '$md',

  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  border: 'none',

  height: '2.75rem',
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.5rem',

  zIndex: 1,
  position: 'sticky',
  backgroundColor: '$appBackground',
  top: '4rem', // Height of navigation bar,

  '&:active': {
    backgroundColor: '$elementActive',
  },
  '&:hover': {
    backgroundColor: '$elementHover',
  },
})

/* NOTE: The collapsible content height matches the maxHeight set manually in code */
const slideDown = keyframes({
  from: { maxHeight: 0, opacity: 0, padding: 0 },
  to: { maxHeight: 'var(--radix-collapsible-content-height)', opacity: 1 },
})

const slideUp = keyframes({
  from: { maxHeight: 'var(--radix-collapsible-content-height)', opacity: 1 },
  to: { maxHeight: 0, opacity: 0, padding: 0 },
})

export const Content = styled(AccordionContent, {
  /* The content aligns the items (wrapped in Box) and the checkboxes */
  display: 'flex',
  flexDirection: 'row',
  gap: '0.75rem',

  /* NOTE: Timing curve sourced from Radix UI's accordion example */
  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
  },
})

export const Caret = styled(CaretRightFill, {
  marginRight: '0.5rem',
  fill: '$lowContrast',
  transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
  '[data-state=open] &': { transform: 'rotate(90deg)' },
})
