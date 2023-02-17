import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@radix-ui/react-dropdown-menu'

import { styled } from './stitches.config'

export const ScientiaTitle = styled('a', {
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const ShortcutLink = styled('a', {
  height: '2.75rem',
  borderRadius: '0.5rem',
  fontSize: 'medium',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.75rem',
  '&:hover': {
    backgroundColor: '$elementHover',
  },
})

const itemStyle = {
  borderRadius: '0.5rem',
  height: '2.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.5rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$sand3',
    color: '$sand12',
  },
  variants: {
    link: {
      true: {
        color: '$sand11',
        backgroundColor: 'transparent',
        textUnderlineThickness: '2px',
        textUnderlineOffset: '4px',
        '&:hover': {
          backgroundColor: 'transparent',
          textDecoration: 'underline',
        },
        '&:focus-visible': {
          color: '$sand12',
          textDecoration: 'underline',
          outline: 'none',
        },
      },
    },
  },
}

export const DropdownIcon = styled('div', {
  padding: '0.75rem',
  svg: { display: 'block', size: 20 },
})

export const Header = styled('div', {
  height: '4rem',
  width: '100%',

  /* Make sure that the header is fixed and above every component */
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2,

  display: 'flex',
  alignContent: 'center',

  padding: '0',
  borderBottom: '0.0625rem solid $separator',
  backgroundColor: '$appBackground',

  transitionProperty: 'background-color, border-bottom',
  transitionDuration: '1s',
  transitionTimingFunction: 'ease-in-out',
})

export const Nav = styled('nav', {
  maxWidth: '42rem',

  display: 'flex',
  flexGrow: 1,
  justifyContent: 'space-between',

  padding: '0 1rem',
  margin: 'auto',
})

export const Logo = styled('img', {
  height: '2rem',
})

export const WebsiteTitle = styled('span', {
  margin: '0 0.5rem',
  fontSize: '$xl',
  fontWeight: 600,
})

export const Content = styled(DropdownMenuContent, {
  width: 'fit-content',
  backgroundColor: '$appBackground',
  borderRadius: '0.75rem',
  padding: '0.5rem',
  border: '0.0625rem solid $separator',
  boxShadow: '$md',
})

export const Item = styled(DropdownMenuItem, itemStyle)

export const CheckboxItem = styled(DropdownMenuCheckboxItem, itemStyle)

export const Separator = styled(DropdownMenuSeparator, {
  height: '0.0625rem',
  margin: '0.25rem',
  backgroundColor: '$separator',
})

export const VerticalRule = styled('div', {
  borderLeft: '1px solid $sand7',
  height: '100%',
  margin: '0 0.5rem',
})

export const YearSwitcherWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: '0.5rem',
  fontSize: '$md',
  alignItems: 'center',
  verticalAlign: 'middle',
})

export const YearArrow = styled('button', {
  display: 'flex',
  width: 'fit-content',
  padding: '0.75rem',
  background: 'transparent',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '$sm',
    backgroundColor: '$sand4',
  },
  variants: {
    disabled: {
      true: {
        visibility: 'hidden',
      },
    },
  },
})
