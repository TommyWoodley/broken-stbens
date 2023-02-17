import { DialogClose, DialogPortal, Dialog as DialogRoot } from '@radix-ui/react-dialog'
import { ReactNode } from 'react'
import { X } from 'react-bootstrap-icons'

import { ActionButton, CloseButton, Content, Overlay, Title } from '../../styles/dialog.style'

const ContentFrame = ({
  children,
  ...props
}: {
  children: ReactNode
  props?: { [x: string]: any }
}) => (
  <DialogPortal>
    <Overlay />
    <Content {...props}>{children}</Content>
  </DialogPortal>
)

const Dialog = ({
  open,
  onOpenChange,
  onPrimaryClick = () => {},
  isFormValid = () => true,
  title,
  primaryButtonText,
  secondaryButtonText,
  children,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  onPrimaryClick?: () => void
  title?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  isFormValid?: () => boolean
  children?: ReactNode
}) => (
  <DialogRoot open={open} onOpenChange={onOpenChange}>
    <ContentFrame>
      {title && <Title>{title}</Title>}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!isFormValid()) return false
          onPrimaryClick()
          onOpenChange(false)
          return true
        }}
      >
        {children}
        {primaryButtonText && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            {secondaryButtonText && (
              <DialogClose asChild>
                <ActionButton.Tertiary style={{ display: 'inline-block' }}>
                  {secondaryButtonText}
                </ActionButton.Tertiary>
              </DialogClose>
            )}
            {primaryButtonText && (
              <ActionButton.Primary
                type="submit"
                style={{ display: 'inline-block', marginLeft: '1rem' }}
              >
                {primaryButtonText}
              </ActionButton.Primary>
            )}
          </div>
        )}
      </form>
      <DialogClose asChild>
        <CloseButton aria-label="Close">
          <X />
        </CloseButton>
      </DialogClose>
    </ContentFrame>
  </DialogRoot>
)

export default Dialog
