import { Indicator, Root } from '@radix-ui/react-progress'

import { styled } from '../stitches.config'

export const Progress = styled(Root, {
  height: '1.375rem',
  width: '100%',
  zIndex: 0 /* Necessary for progress animation on Safari */,
  overflow: 'hidden',
  background: '$sand5',
  borderRadius: '1rem',
})

export const ProgressIndicator = styled(Indicator, {
  backgroundColor: '$lowContrast',
  height: '100%',
  transition: 'transform 500ms cubic-bezier(0.65, 0, 0.35, 1)',
})
