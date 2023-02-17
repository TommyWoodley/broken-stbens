import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { plainToInstance } from 'class-transformer'
import { InfoCircle } from 'react-bootstrap-icons'
import { matchPath, useLocation } from 'react-router-dom'

import { Button } from '../styles/_app.style'
import { styleExerciseItem } from '../styles/exerciseItem.style'
import { Content } from '../styles/navigation.style'
import { styled } from '../styles/stitches.config'
import { Exercise } from '../types/schemas/abc'

const ExerciseExample = styled('div', { borderRadius: '0.5rem', padding: '0.75rem' })

const TimelineGuideButton = () => {
  const { pathname } = useLocation()
  const timelinePath = matchPath({ path: '/:year/timeline' }, pathname)

  const examples = [
    {
      title: 'Assessed group exercise',
      exercise: { submission_type: 'group', is_assessed: true },
    },
    {
      title: 'Assessed individual exercise',
      exercise: { submission_type: 'individual', is_assessed: true },
    },
    {
      title: 'Unassessed and requires submission',
      exercise: { submission_type: 'individual', is_assessed: false },
    },
    {
      title: 'Unassessed, no submission required',
      exercise: { submission_type: 'no submission required', is_assessed: false },
    },
  ]

  return timelinePath ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon title="Timeline guide">
          <InfoCircle size={22} />
        </Button>
      </DropdownMenuTrigger>
      <Content
        align="start"
        style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        {examples.map(({ title, exercise }) => (
          <ExerciseExample key={title} css={styleExerciseItem(plainToInstance(Exercise, exercise))}>
            {title}
          </ExerciseExample>
        ))}
      </Content>
    </DropdownMenu>
  ) : null
}

export default TimelineGuideButton
