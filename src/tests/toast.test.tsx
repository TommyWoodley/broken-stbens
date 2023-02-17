import { act, fireEvent, render, screen } from '@testing-library/react'

import { ToastProps } from '../components/Toast'
import { ToastProvider, useToast } from '../lib/toast.context'
import { ToastVariant } from '../styles/toast.style'

const Toaster = (toasts: ToastProps[] = [{ title: 'Toast title', variant: 'info' }]) => {
  const TestComponent = () => {
    const { addToast } = useToast()
    return <p data-testid="add-toasts" onClick={() => toasts.map(addToast)} />
  }
  return (
    <ToastProvider>
      <TestComponent />
    </ToastProvider>
  )
}

/* Radix renders 2 elements with role "status" for each toast */
const TOAST_ROLE = 'status'

describe('Toast', () => {
  it.each([
    ['zero', []],
    [
      'two',
      [
        {
          title: 'An errorful toast',
          variant: 'error' as ToastVariant,
        },
        {
          title: 'A successful toast',
          variant: 'success' as ToastVariant,
        },
      ],
    ],
  ])(`can be rendered (%s)`, (_, data) => {
    render(Toaster(data))
    fireEvent.click(screen.getByTestId('add-toasts'))
    expect(screen.queryAllByRole(TOAST_ROLE)).toHaveLength(data.length * 2)
  })

  it('disappears after 5 seconds', () => {
    jest.useFakeTimers()
    render(Toaster())
    fireEvent.click(screen.getByTestId('add-toasts'))
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(screen.queryByRole(TOAST_ROLE)).not.toBeInTheDocument()
    jest.useRealTimers()
  })

  it('shows given title as text', () => {
    render(Toaster())
    fireEvent.click(screen.getByTestId('add-toasts'))
    expect(screen.getAllByRole(TOAST_ROLE)[0].textContent).toEqual('Toast title')
  })
})
