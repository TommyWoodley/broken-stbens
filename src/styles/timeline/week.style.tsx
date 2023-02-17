import { styled } from '../stitches.config'

/* The header contains week information: the number and date range */
export const Header = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem',
  borderRadius: '0.5rem',

  backgroundColor: '$elementBackground',
  variants: {
    active: {
      true: {
        fontWeight: 600,
      },
    },
  },
})

export const Day = styled('div', {
  minWidth: '3rem',
  width: '3rem',
  backgroundColor: 'transparent',
  textAlign: 'center',
  variants: {
    active: {
      true: {
        color: '$primary11',
        fontWeight: 600,
      },
    },
  },
})
