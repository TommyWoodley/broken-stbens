import { theme } from '../stitches.config'

export const progressCircleStyle: any = {
  root: { width: '100%', verticalAlign: 'middle' },
  path: {
    stroke: `${theme.colors.lowContrast}`,
    transition: 'stroke-dashoffset 500ms cubic-bezier(0.65, 0, 0.35, 1)',
  },
  trail: {
    stroke: `${theme.colors.sand5}`,
  },
}
