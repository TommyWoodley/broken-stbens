import * as SelectPrimitive from '@radix-ui/react-select'
import React from 'react'

import { styled } from './stitches.config'

// Adapted from: https://www.radix-ui.com/docs/primitives/components/select

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.5rem',
  padding: '0 1rem',
  fontSize: '1rem',
  lineHeight: 1,
  height: '2.719rem',
  flexGrow: 1,
  gap: 6,
  boxShadow: '$sm',
  backgroundColor: '$appBackground',
  border: '1px solid $sand7',
  cursor: 'pointer',
  color: '$elementHover',
  '&:hover': { backgroundColor: '$elementHover' },
  '&[data-placeholder]': { color: '$elementHover' },
})

const StyledIcon = styled(SelectPrimitive.SelectIcon, {
  color: '$highContrast',
})

const StyledContent = styled(SelectPrimitive.Content, {
  overflow: 'hidden',
  backgroundColor: '$elementBackground',
  borderRadius: 6,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  zIndex: 6,
})

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 8,
  zIndex: 6,
})

function Content({ children, ...props }: any) {
  return (
    <SelectPrimitive.Portal>
      <StyledContent {...props}>{children}</StyledContent>
    </SelectPrimitive.Portal>
  )
}

const StyledItem = styled(SelectPrimitive.Item, {
  all: 'unset',
  fontSize: '1rem',
  lineHeight: 1,
  color: '$lowContrast',
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 24,
  padding: '0 35px 0 25px',
  position: 'relative',
  userSelect: 'none',
  cursor: 'pointer',

  '&[data-disabled]': {
    color: '$elementBackground',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: '$elementActive',
    color: '$highContrast',
  },
})

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 24,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 24,
  backgroundColor: '$elementBackground',
  color: '$lowContrast',
  cursor: 'default',
}

const StyledScrollUpButton = styled(SelectPrimitive.ScrollUpButton, scrollButtonStyles)

const StyledScrollDownButton = styled(SelectPrimitive.ScrollDownButton, scrollButtonStyles)

export const Select = SelectPrimitive.Root
export const SelectTrigger = StyledTrigger
export const SelectValue = SelectPrimitive.Value
export const SelectIcon = StyledIcon
export const SelectContent = Content
export const SelectViewport = StyledViewport
export const SelectItem = StyledItem
export const SelectItemText = SelectPrimitive.ItemText
export const SelectItemIndicator = StyledItemIndicator
export const SelectScrollUpButton = StyledScrollUpButton
export const SelectScrollDownButton = StyledScrollDownButton
