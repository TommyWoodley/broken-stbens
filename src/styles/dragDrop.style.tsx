import { DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd'

import { Button } from './_app.style'
import { styled, theme } from './stitches.config'

const { colors, shadows } = theme

export const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? `${colors.sand3}` : '',
  borderRadius: '0.5rem',
})

export const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  userSelect: 'none',
  ...(isDragging && {
    boxShadow: shadows.md,
    borderRadius: '0.25rem',
    border: `2px solid ${colors.sand10}`,
    background: `${colors.blue5}`,
  }),
  ...draggableStyle,
})

export const ToggleDragDropButton = styled(Button, {
  variants: {
    dragEnabled: {
      true: {
        backgroundColor: '$blue9',
        '&:hover': { backgroundColor: '$blue10' },
        shadow: '$sm',
        svg: { fill: 'white' },
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
})
