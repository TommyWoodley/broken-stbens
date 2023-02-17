import { act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import Immutable from 'immutable'

import { useLevels } from '../../lib/game/levels.service'
import { fakeLevel1Resource, fakeLevel2Resources, fakeLeveledMaterials } from './fakeLevelMaterials'

describe('Levels manager', () => {
  const { result } = renderHook(() => useLevels())

  const completeResources = Immutable.Set([fakeLevel1Resource.id, fakeLevel2Resources[0].id])

  act(() => {
    result.current.setTotalLevels(2)
    result.current.updateLevel(fakeLeveledMaterials, completeResources)
  })

  it('can calculate level and percentage progress from complete resources', () => {
    expect(result.current.level).toBe(2)
    expect(result.current.progress).toBe(50)
  })

  it('switches to next level when a level is complete', () => {
    expect(result.current.selectedLevel).toBe(2)
  })
})
