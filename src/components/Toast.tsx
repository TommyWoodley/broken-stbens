import {
  ToastIcons,
  Root as ToastRoot,
  Title as ToastTitle,
  ToastVariant,
} from '../styles/toast.style'

/*  Toasts display brief, temporary notifications.
    Only used for:
      - confirmations
      - simple notifications
      - low-priority alerts
    They are noticeable, do not disrupt the user experience and do not require an action to be taken. 
    Usage Guide: https://spectrum.adobe.com/page/toast/   */

export interface ToastProps {
  variant: ToastVariant
  title: string
}

export const Toast = ({ variant, title }: ToastProps) => {
  const ToastIcon = ToastIcons[variant]
  return (
    <ToastRoot color={variant}>
      <ToastIcon size={24} />
      <ToastTitle>{title}</ToastTitle>
    </ToastRoot>
  )
}
