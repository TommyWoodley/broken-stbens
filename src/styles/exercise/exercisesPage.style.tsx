import { css, styled } from '../stitches.config'

export const Header = styled('th', {
  textAlign: 'left',
  fontWeight: 600,
})

export const Pill = styled('p', {
  background: '$blue4',
  fontSize: '$sm',
  borderRadius: '16px',
  padding: '4px 12px',
  display: 'inline-block',
  width: 'fit-content',
  margin: 0,
  textAlign: 'center',
})

export const SubText = styled('div', {
  color: '$sand10',
  fontSize: '$sm',
  marginTop: '2px',
})

const shadowSm = '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)'

export const Table = styled('table', {
  flexGrow: 1,
  alignSelf: 'center',
  borderSpacing: '1.25rem',
  '@media (max-width: 35rem)': { borderSpacing: '1rem' },
})

export const HorizontalRow = ({ colSpan }: { colSpan: number }) => (
  <tr>
    <td className={css({ borderBottom: '1px solid $sand7' })()} colSpan={colSpan}></td>
  </tr>
)

export const ViewExerciseButton = styled('a', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  minWidth: 'min(fit-content,1px)',
  // maxWidth: 'max-content',
  padding: '0.75rem',

  borderRadius: '8px',
  border: '1px solid $sand7',
  boxShadow: shadowSm,

  color: '$sand12',
  fontWeight: 500,
  fontSize: '$md',

  cursor: 'pointer',
  transition: 'backgroundColor .1s ease-in',
  backgroundColor: '$sand1',
  '&:hover': {
    backgroundColor: '$sand4',
  },
  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
        pointerEvents: 'none',
        opacity: '70%',
        '&:hover': {
          backgroundColor: 'white',
        },
      },
    },
  },
})
