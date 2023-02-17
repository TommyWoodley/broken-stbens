import { DialogContent, DialogOverlay, DialogTitle } from '@radix-ui/react-dialog'
import { keyframes } from '@stitches/react'

import { styled } from './stitches.config'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

export const Overlay = styled(DialogOverlay, {
  backgroundColor: '$overlayBackground',
  backdropFilter: 'blur(8px)',
  position: 'fixed',
  zIndex: 9,
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

export const Content = styled(DialogContent, {
  overflow: 'scroll',
  backgroundColor: '$appBackground',
  borderRadius: 8,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
  minWidth: '40rem',
  maxHeight: '90vh',
  padding: '2rem',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
})

export const CloseButton = styled('button', {
  borderRadius: '50%',
  width: 'fit-content',
  cursor: 'pointer',
  color: '$sand11',
  fontSize: '$xxl',
  display: 'inline-flex',
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '$sand1',
  border: 'none',
  '&:hover': { backgroundColor: '$sand4' },
})
export const Title = styled(DialogTitle, {
  margin: 0,
  marginBottom: '1rem',
  fontWeight: 500,
  color: '$highContrast',
  fontSize: 18,
})

const ButtonTemplate = styled('button', {
  padding: '0.75rem 1.5rem',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  width: 'fit-content',
  borderRadius: '8px',
})

export const ActionButton = {
  Primary: styled(ButtonTemplate, {
    border: '2px solid $primary9',
    background: '$primary9',
    color: 'white',
    boxShadow: '$sm',
    '&:hover': {
      backgroundColor: '$primary10',
      borderColor: '$primary10',
    },
    '&:focus': {
      borderColor: '$primary12',
      outline: '2px dotted transparent',
      outlineOffset: '2px',
    },
    variants: {
      color: {
        destructive: {
          backgroundColor: '$errorBackground',
          '&:hover': {
            backgroundColor: '$red11',
          },
          border: '2px solid $errorBackground',
        },
      },
    },
  }),
  Secondary: styled(ButtonTemplate, {
    border: '2px solid $primary8',
    color: '$primary11',
    boxShadow: '$sm',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: '$primary4',
    },
  }),
  Tertiary: styled(ButtonTemplate, {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
    outline: 'none',
    border: 'none',
    color: '$sand10',
    textUnderlineThickness: '2px',
    textUnderlineOffset: '4px',
    '&:hover': {
      color: '$sand12',
    },
  }),
}
