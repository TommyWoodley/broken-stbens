import { fireEvent, render, screen, within } from '@testing-library/react'

import Dialog from '../components/dialogs/Dialog'

const DialogFactory = ({
  open = true,
  onOpenChange = (_) => {},
  onPrimaryClick = () => {},
  title = 'Dialog title',
  primaryButtonText = 'primary',
  secondaryButtonText = 'secondary',
}: {
  open?: boolean
  onOpenChange?: (_: boolean) => void
  onPrimaryClick?: () => void
  title?: string
  primaryButtonText?: string
  secondaryButtonText?: string
}) => {
  return (
    <Dialog
      {...{ open, onOpenChange, onPrimaryClick, title, primaryButtonText, secondaryButtonText }}
    />
  )
}

describe('Dialog', () => {
  it(`renders dialog with 3 buttons when open`, () => {
    render(DialogFactory({ open: true }))
    const dialog = screen.queryByRole('dialog')
    expect(dialog).toBeInTheDocument()
    const buttons = within(screen.getByRole('dialog')).queryAllByRole('button')
    expect(buttons).toHaveLength(3)
  })

  it(`does not render dialog when closed`, () => {
    render(DialogFactory({ open: false }))
    const dialog = screen.queryByRole('dialog')
    expect(dialog).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it.each(['primary', 'secondary'])(`closes dialog when you click %s button`, (buttonText) => {
    const onOpenChange = jest.fn((_: boolean) => {})
    render(DialogFactory({ onOpenChange }))
    fireEvent.click(screen.getByText(buttonText))
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })

  it('calls for intended action when clicking primary button', () => {
    const onPrimaryClick = jest.fn()
    render(DialogFactory({ onPrimaryClick }))
    fireEvent.click(screen.getByText('primary'))
    expect(onPrimaryClick).toHaveBeenCalledTimes(1)
  })
})
