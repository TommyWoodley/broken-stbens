import { ActionButton } from '../dialog.style'
import { styled, theme } from '../stitches.config'

export const Button = styled(ActionButton.Primary, {
  display: 'inline-flex',
  alignItems: 'center',
  variants: {
    disabled: {
      true: {
        opacity: '30%',
        cursor: 'not-allowed',
      },
    },
  },
})

export const SendInviteButton = styled(ActionButton.Primary, {
  display: 'inline-flex',
  alignItems: 'center',
  variants: {
    disabled: {
      true: {
        opacity: '30%',
        cursor: 'not-allowed',
      },
    },
  },
})

export const Wrapper = styled('div', {
  display: 'flex',
  marginBottom: '1rem',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  borderRadius: '12px',
  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.06)) drop-shadow(0 1px 3px rgba(0,0,0,.1))',
  color: '$highContrast',
  backgroundColor: '$sand1',
})

export const MemberName = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginLeft: '0.5rem',
})

export const MemberRole = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginRight: '1rem',
  fontWeight: 500,
  color: '$sand11',
})

const { colors } = theme

export const DropdownStyle = {
  option: (provided: any, state: any) => ({
    ...provided,
    padding: '0.9rem',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    color: state.isDisabled ? colors.highContrast.toString() : colors.sand9.toString(),
    backgroundColor: state.isSelected
      ? colors.elementActive.toString()
      : colors.appBackground.toString(),
    '&:hover': {
      backgroundColor: state.isDisabled ? '' : colors.elementHover.toString(),
    },
  }),
  multiValueContainer: (provided: any) => ({
    ...provided,
    width: 'fit-content',
    // https://react-select.com/styles#select-props
    // https://stackoverflow.com/questions/50620369/react-select-is-disabled-cant-change-color
  }),
  multiValue: (provided: any, state: any) => ({
    ...provided,
    width: 'fit-content',
    border: '2px solid ' + colors.sand6.toString(),
    borderRadius: '14px',
    padding: '4px',
    backgroundColor: colors.sand2.toString(),
    color: colors.highContrast.toString(),
    cursor: 'default',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    borderRadius: '16px',
    cursor: 'pointer',
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: 0,
    borderRadius: '0.5rem',
  }),
  menu: (provided: any) => ({
    ...provided,
    padding: 0,
    marginTop: '0.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: colors.appBackground.toString(),
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: colors.highContrast.toString(),
    cursor: 'pointer',
  }),
  indicatorContainer: (provided: any) => ({
    ...provided,
    cursor: 'pointer',
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: colors.highContrast.toString(),
    cursor: 'pointer',
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    // none of react-select's styles are passed to <Control />
    boxSizing: 'border-box',
    width: '100%',
    borderColor: state.isFocused
      ? colors.solidBackground.toString()
      : colors.elementBorder.toString(),
    borderRadius: '0.5rem',
    padding: '0.25rem',
    backgroundColor: colors.appBackground.toString(),
    cursor: 'text',
  }),
  input: (provided: any) => ({
    ...provided,
    color: colors.highContrast.toString(),
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: colors.solidBackground.toString(),
  }),
  container: (provided: any) => ({
    ...provided,
    width: 'auto',
    marginRight: '1rem',
    flexGrow: 1,
  }),
}
