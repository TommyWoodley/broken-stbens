import { CSSProperties, ComponentType } from 'react'
import { Award, Circle, Icon, Star } from 'react-bootstrap-icons'

export type NumberedIcon = ComponentType<{ size?: number; value: number }>
export const NumberedStar = numberedIconGenerator(Star, 0.35, { paddingTop: '0.25em' }, 'gold')
export const NumberedAward = numberedIconGenerator(Award, 0.4, { paddingBottom: '0.65em' })
export const NumberedCircle = numberedIconGenerator(Circle, 0.6)

function numberedIconGenerator(
  Icon: Icon,
  fontScale: number,
  valueStyle: CSSProperties = {},
  color?: string
): NumberedIcon {
  return ({ value, size = 22 }: { value: number; size?: number }) => (
    <OverlappingWrapper style={{ userSelect: 'none' }}>
      <Icon color={color} size={size} />
      <span style={{ fontSize: fontScale * size, ...valueStyle }}>{value}</span>
    </OverlappingWrapper>
  )
}

const OverlappingWrapper = ({
  style,
  children,
}: {
  style?: CSSProperties
  children: React.ReactNode[]
}) => {
  const overlappingStyle: CSSProperties = {
    display: 'grid',
    gridRowStart: 1,
    gridColumnStart: 1,
    justifySelf: 'center',
    alignSelf: 'center',
  }

  return (
    <div style={{ ...style, display: 'grid' }}>
      {children.map((child, index) => (
        <div key={index} style={overlappingStyle}>
          {child}
        </div>
      ))}
    </div>
  )
}
