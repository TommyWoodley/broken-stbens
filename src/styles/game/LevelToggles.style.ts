import { Item, Root } from '@radix-ui/react-toggle-group'

import { styled } from '../stitches.config'

export const ScrollArrow = styled('button', {
  width: '2.75rem',
  height: '100%',
  display: 'flex',
  transition: 'all 250ms ease-in-out 0s',
  border: '0.25rem solid transparent',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$elementBackground',
  '&:first-child': { borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' },
  '&:last-child': { borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem' },
  '&:hover': {
    backgroundColor: '$elementHover',
  },
  '&:focus-visible': {
    outline: 'none',
    border: '0.25rem solid $elementBorder',
  },
  variants: {
    disabled: {
      true: {
        svg: {
          fill: '$sand8',
        },
      },
    },
  },
})

export const ToggleGroup = styled(Root, {
  width: '100%',
  height: '100%',
  display: 'flex',
})

export const Toggle = styled(Item, {
  flexBasis: '100%',
  transition: 'all 250ms ease-in-out 0s',
  flexGrow: 1,
  backgroundColor: '$elementBackground',
  border: '0.25rem solid transparent',
  '&:hover': { backgroundColor: '$elementHover' },
  '&:focus-visible': {
    outline: 'none',
    border: '0.25rem solid $elementBorder',
  },
  '&[data-state=on]': { backgroundColor: '$elementActive' },
})
