import { Icon } from 'react-bootstrap-icons'

import { Wrapper } from '../../styles/_app.style'

export const Statistic = ({
  title,
  Icon,
  gridColumns = 1,
  children,
}: {
  title?: string
  Icon?: Icon
  gridColumns?: number
  children?: React.ReactNode
}) => {
  const statisticWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$subtleBackground',
    borderRadius: '0.75rem',
    padding: '1rem',
    gap: '1rem',
    gridColumnStart: `span ${gridColumns}`,
  }

  const contentWrapperStyle = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  }

  return (
    <Wrapper css={statisticWrapperStyle}>
      <Wrapper inline>
        {Icon && <Icon size={22} />}
        {title && <b>{title}</b>}
      </Wrapper>
      <Wrapper css={contentWrapperStyle}>{children}</Wrapper>
    </Wrapper>
  )
}
