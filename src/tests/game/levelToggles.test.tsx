import { fireEvent, render, screen } from '@testing-library/react'

import { LEVEL_GROUP_SIZE, LevelToggles } from '../../components/game/LevelToggles'
import { mockLevelsManagerFactory } from './fakeLevelMaterials'

describe('LevelToggles', () => {
  it.each([
    ['one', { totalLevels: 1 }],
    ['two', { totalLevels: 2 }],
    ['three', { totalLevels: 3 }],
    ['four', { totalLevels: 4 }],
    ['sevon', { totalLevels: 7 }],
    ['fifteen', { totalLevels: 15 }],
  ])(`can be rendered with %s level(s)`, (_, { totalLevels }) => {
    render(<LevelToggles {...mockLevelsManagerFactory({ totalLevels })} />)
    expect(screen.queryAllByRole('radio')).toHaveLength(Math.min(totalLevels, LEVEL_GROUP_SIZE))
  })

  it(`can change level`, () => {
    const levelsManager = mockLevelsManagerFactory({ totalLevels: 4, level: 2 })
    render(<LevelToggles {...levelsManager} />)

    const levelGroupButtons = screen.queryAllByRole('radio')
    fireEvent.click(levelGroupButtons[1])

    expect(levelsManager.setSelectedLevel).toBeCalledWith(2)
  })

  it(`disables left arrow focus when at leftmost position`, () => {
    render(<LevelToggles {...mockLevelsManagerFactory({})} />)
    const leftArrow = screen.queryAllByRole('button')[0]
    expect(leftArrow).toHaveAttribute('tabindex', '-1')
  })

  it('can change level group', () => {
    const levelsManager = mockLevelsManagerFactory({ totalLevels: 7, level: 6 })
    render(<LevelToggles {...levelsManager} />)

    /* Right arrow should become disabled */
    const rightArrow = screen.queryAllByRole('button')[1]
    fireEvent.click(rightArrow)
    expect(rightArrow).toHaveAttribute('tabindex', '-1')

    /* Toggle should select from new group */
    const levelGroupButtons = screen.queryAllByRole('radio')
    fireEvent.click(levelGroupButtons[1])
    expect(levelsManager.setSelectedLevel).toBeCalledWith(2 + LEVEL_GROUP_SIZE)
  })

  it('can not change to a locked level', () => {
    const levelsManager = mockLevelsManagerFactory({ totalLevels: 4, level: 2 })
    render(<LevelToggles {...levelsManager} />)

    const levelGroupButtons = screen.queryAllByRole('radio')
    fireEvent.click(levelGroupButtons[3])

    expect(levelsManager.setSelectedLevel).not.toBeCalled()
  })
})
