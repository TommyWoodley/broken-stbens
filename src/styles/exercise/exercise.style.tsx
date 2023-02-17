import { Progress, ProgressIndicator } from '@radix-ui/react-progress'
import { BoxArrowUpRight } from 'react-bootstrap-icons'

import { styled } from '../stitches.config'

export const Link = styled('a', {
  fontSize: '$lg',
  cursor: 'pointer',
  width: 'fit-content',
  whiteSpace: 'nowrap',
  color: '$sand12',
  fill: '$sand12',
  textDecoration: 'underline',
  textUnderlineThickness: '1px',
  textUnderlineOffset: '4px',
  textDecorationColor: '$sand8 !important',
  '&:hover': {
    textDecoration: 'underline',
    textDecorationColor: '$sand12 !important',
  },
})

export const UploadWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  minWidth: '60%',
  maxWidth: '100%',
})

const shadowSM = '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)'

export const UploadTrigger = styled('label', {
  all: 'unset',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '1rem',
  borderRadius: '4px',
  color: '$highContrast',
  cursor: 'pointer',
  verticalAlign: 'middle',
  border: '1px dashed $sand8',
  backgroundColor: '$sand1',
  '&:hover': { backgroundColor: '$sand2' },
  variants: {
    submitted: {
      true: {
        border: '1px solid $sand6',
        borderLeft: '4px solid $green9',
        boxShadow: shadowSM,
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        '&:hover': { backgroundColor: '$sand1' },
      },
    },
  },
})

export const ModulePill = styled('p', {
  background: '$blue5',
  fontSize: '$sm',
  borderRadius: '999px',
  padding: '4px 12px',
  display: 'inline-flex',

  alignItems: 'center',
  width: 'fit-content',
  whiteSpace: 'nowrap',
  height: 'fit-content',
  margin: 0,
  textAlign: 'center',
})

export const ResourcesWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const LinkIcon = styled(BoxArrowUpRight, {
  marginRight: '0.5rem',
  fill: 'inherit',
})

export const Deadline = styled('p', {
  fontSize: '$md',
  fontWeight: 600,
  color: '$highContrast',
  variants: {
    completed: {
      true: {
        fontWeight: 'normal',
      },
    },
  },
})

export const Footer = styled('footer', {
  fontSize: '$sm',
  color: '$sand11',
  margin: '1rem 0 3rem 0',
  textAlign: 'center',
})

const StyledProgress = styled(Progress, {
  position: 'relative',
  overflow: 'hidden',
  background: '$sand4',
  borderRadius: '32px',
  width: '100%',
  height: '1rem',
  // Fix overflow clipping in Safari
  // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
  transform: 'translateZ(0)',
  display: 'flex',
  alignItems: 'center',
})

const StyledProgressIndicator = styled(ProgressIndicator, {
  backgroundColor: '$green9',
  height: '100%',
  transition: 'width 660ms cubic-bezier(0.65, 0, 0.35, 1)',
  padding: '8px',
  borderTopLeftRadius: '16px',
  borderBottomLeftRadius: '16px',
  justifyContent: 'end',
  display: 'flex',
  alignItems: 'center',
})

export const ProgressBar = ({ value, max }: { value: number; max: number }) => (
  <StyledProgress value={value} max={max}>
    <StyledProgressIndicator asChild>
      <div
        style={{
          width: `${Math.round((100 * value) / max)}%`,
          textAlign: 'center',
          ...(value === max && { borderRadius: '32px' }),
        }}
      ></div>
    </StyledProgressIndicator>
  </StyledProgress>
)
