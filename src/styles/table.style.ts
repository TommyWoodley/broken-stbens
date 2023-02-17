import { styled } from './stitches.config'

export const Input = styled('input', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$appBackground',
  border: 'none',
  borderBottom: '0.02rem solid $sand5',
})

export const Table = styled('table', {
  borderSpacing: '0',
  width: '100%',
})

export const Th = styled('th', {
  variants: {
    expander: {
      true: {
        padding: '1rem 0 1rem 0',
      },
    },
  },
  padding: '1rem 0.5rem 1rem 0.5rem',
  textAlign: 'left',
  borderBottom: '0.1rem solid $sand7',
})

export const ThContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
})

export const Td = styled('td', {
  padding: '0.5rem',
  variants: {
    expander: {
      true: {
        padding: '0.5rem 0 0.5rem 0',
      },
    },
    subRow: {
      true: {
        backgroundColor: '$sand3',
        borderRightColor: '$sand3',
        borderLeftColor: '$sand3',
      },
    },
  },
})
