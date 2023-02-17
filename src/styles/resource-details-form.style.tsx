import * as LabelPrimitive from '@radix-ui/react-label'

import './editDialog.css'
import { styled, theme } from './stitches.config'

export const Label = styled(LabelPrimitive.Root, {
  fontSize: 14,
  color: '$lowContrast',
  lineHeight: '0.2rem',
  marginBottom: '0.2rem',
})

export const NowButton = styled('button', {
  padding: '0.5rem',
  float: 'left',
  backgroundColor: '$sand5',
  borderRadius: '8px',
  borderStyle: 'solid',
  borderColor: '$sand9',
  verticalAlign: 'left',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$sand7',
  },
})

export const ApplyToAllButton = styled('button', {
  cursor: 'pointer',
  float: 'right',
  padding: '0.25rem',
  backgroundColor: '$sand6',
  borderRadius: '8px',
  borderStyle: 'none',
  '&:hover': {
    backgroundColor: '$sand8',
  },
})

const Input = styled('input', {
  all: 'unset',
  boxSizing: 'border-box',
  width: '100%',
  borderRadius: '0.5rem',
  border: '0.0625rem solid $elementBorder',
  padding: '0.75rem',
  height: '2.75rem',
  backgroundColor: '$appBackground',
  transition: 'background-color 0.3s ease-in-out',
  '&:hover': {
    borderColor: '$solidBackground',
  },
  '&:focus': {
    borderColor: '$solidBackground',
  },
})

export const TitleInput = styled(Input, {})

export const CalendarInput = styled(Input, {
  flex: 1,
})

export const TimeInput = styled(Input, {
  flex: 1,
})

export const Visibility = styled('div', {
  fontSize: '0.8rem',
  color: '$lowContrast',
  textAlign: 'right',
})

export const DropdownStyle = {
  option: (provided: any, state: any) => ({
    ...provided,
    padding: '0.9rem',
    cursor: 'pointer',
    color: theme.colors.highContrast.toString(),
    backgroundColor: state.isSelected
      ? theme.colors.elementActive.toString()
      : theme.colors.appBackground.toString(),
    '&:hover': {
      backgroundColor: theme.colors.elementHover.toString(),
    },
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
    backgroundColor: theme.colors.appBackground.toString(),
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: theme.colors.highContrast.toString(),
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: theme.colors.highContrast.toString(),
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    // none of react-select's styles are passed to <Control />
    boxSizing: 'border-box',
    width: '100%',
    borderColor: state.isFocused
      ? theme.colors.solidBackground.toString()
      : theme.colors.elementBorder.toString(),
    borderRadius: '0.5rem',
    padding: '0.25rem',
    height: '2.75rem',
    backgroundColor: theme.colors.appBackground.toString(),
    transition: 'background-color 0.3s ease-in-out',
    cursor: 'text',
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    color: theme.colors.highContrast.toString(),
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    color: theme.colors.solidBackground.toString(),
  }),
  singleValue: (provided: any, state: any) => {
    let opacity = state.isDisabled ? 0 : 1
    opacity = state.isSelected ? 0.5 : opacity
    const transition = 'opacity 300ms'
    return { ...provided, opacity, transition, color: theme.colors.highContrast.toString() }
  },
}
