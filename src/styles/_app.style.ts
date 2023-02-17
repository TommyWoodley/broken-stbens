import { CheckboxIndicator, Checkbox as CheckboxPrimitive } from '@radix-ui/react-checkbox'
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@radix-ui/react-scroll-area'

import { DIVIDER_HEIGHT } from '../constants/global'
import { styled } from './stitches.config'

export const Container = styled('div', {
  maxWidth: '42rem',
  margin: 'auto',
  padding: '7rem 1rem 0 1rem',
  display: 'flex',
  flexDirection: 'column',
  variants: {
    center: {
      /* Center the content contained within */
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    expand: {
      /* Expand vertically and horizontally to fill the rest of the page */
      true: {
        minHeight: '100vh',
        height: '100vh',
        minWidth: '100vw',
        width: '100vw',
      },
    },
    dotted: {
      true: {
        $$dotSpace: '1.5rem',
        $$dotSize: '0.0625rem',
        background: `linear-gradient(90deg, $appBackground calc($$dotSpace - $$dotSize), transparent 1%) center,
                     linear-gradient($appBackground calc($$dotSpace - $$dotSize), transparent 1%) center, 
                     $solidBackground`,
        backgroundSize: '$$dotSpace $$dotSpace',
      },
    },
    timeline: {
      true: {
        $$columnWidth: '16.875rem',
        $$rowHeight: '7rem',
        $$navHeight: '4rem',
        display: 'grid',
        gridTemplateAreas: "'switcher weeks' 'modules background'",
        gridTemplateRows: 'auto',
        gridTemplateColumns: '$$columnWidth auto',
        gridGap: '0.5rem',

        /* Overridden default values */
        padding: '0',
        maxWidth: '100%',
      },
    },
  },
})

const defaultButtonStyle = {
  backgroundColor: '$elementBackground',
  color: '$highContrast',
  height: '2.75rem',
  border: 'none',
  borderRadius: '0.5rem',
  fontSize: 'medium',
  userSelect: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 1rem 0 1rem',
  width: 'auto',
}

export const AnchorButton = styled('a', {
  ...defaultButtonStyle,
  variants: {
    thin: {
      true: {
        height: '2rem',
        padding: '0 0.5rem 0 0.5rem',
      },
    },
  },
})
export const Button = styled('button', {
  ...defaultButtonStyle,

  '&:hover': {
    backgroundColor: '$elementHover',
  },
  '&:active': {
    backgroundColor: '$elementActive',
  },
  "&[data-state='open']": {
    backgroundColor: '$elementActive',
  },

  variants: {
    warning: {
      true: {
        backgroundColor: '$amber4',
        '&:hover': {
          backgroundColor: '$amber6',
        },
      },
    },
    block: {
      true: {
        width: '100%',
      },
    },
    icon: {
      true: {
        width: '2.75rem',
        background: 'none',
        padding: '0',
      },
    },
    active: {
      true: {
        backgroundColor: '$neutral6',
        '&:hover': { backgroundColor: '$elementHover' },
      },
    },
    disabled: {
      true: {
        opacity: '30%',
        cursor: 'not-allowed',
      },
    },
    /* Press and hold animation */
    animate: {
      true: {
        transition:
          'transform 250ms cubic-bezier(.2, .8, .4, 1), background-color 250ms ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
      },
    },
  },
})

export const Footnote = styled('p', {
  fontSize: '$footnote',
  variants: {
    muted: {
      true: {
        color: '$lowContrast',
      },
    },
    center: {
      true: {
        textAlign: 'center',
      },
    },
  },
})

export const StandardDiv = styled('div', {
  all: 'unset',
  justifyContent: 'space-between',
  display: 'flex',
  flexGrow: 2,
  padding: '0.75rem',
  background: '$sand3',
  borderRadius: '0.5rem',
})

export const Wrapper = styled('div', {
  width: '100%',
  variants: {
    inline: {
      true: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
      },
    },
  },
})

export const Banner = styled('div', {
  width: '100%',
  backgroundColor: '$subtleBackground',
  borderRadius: '0.5rem',
  variants: {
    level: {
      warning: {
        backgroundColor: '$warningBackground',
      },
    },
    center: {
      true: {
        minHeight: '10rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1rem',
      },
    },
    inline: {
      true: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
      },
    },
  },
})

/* The following code was inspired by the Radix UI scroll area codesandbox:
 * https://codesandbox.io/s/vwrqpu?module=App.js&file=/App.js
 */
export const Area = styled(ScrollArea, {
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
})

export const Viewport = styled(ScrollAreaViewport, {
  height: '100%',
  width: '100%',
  backgroundColor: '$appBackground',
})

export const Scrollbar = styled(ScrollAreaScrollbar, {
  display: 'flex',
  userSelect: 'none',
  touchAction: 'none',
  padding: '0.125rem',

  '&[data-orientation="vertical"]': { width: '0.75rem' },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height: '0.75rem',
  },

  backgroundColor: '$subtleBackground',
  zIndex: 6,
})

export const Thumb = styled(ScrollAreaThumb, {
  flex: 1,
  backgroundColor: '$solidBackground',
  borderRadius: '0.375rem',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: '2.75rem',
    minHeight: '2.75rem',
  },
  '&:hover, &:active': {
    backgroundColor: '$solidHover',
  },
})

export const Corner = styled(ScrollAreaCorner, {
  background: '$subtleBackground',
})

export const Checkbox = styled(CheckboxPrimitive, {
  all: 'unset',
  boxSizing: 'border-box',
  backgroundColor: '$elementBackground',
  width: '1.75rem',
  minWidth: '1.75rem',
  height: '1.75rem',
  minHeight: '1.75rem',
  borderRadius: '0.375rem',
  '&:hover': { backgroundColor: '$elementHover' },
  '&:focus': {
    backgroundColor: '$appBackground',
    border: '0.0625rem solid $elementBorder',
  },
})

export const Indicator = styled(CheckboxIndicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
export const Hr = styled('hr', {
  backgroundColor: '$sand7',
  border: 'none',
  height: DIVIDER_HEIGHT,
  width: 'auto',
})
