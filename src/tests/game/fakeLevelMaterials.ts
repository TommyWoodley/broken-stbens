import Immutable from 'immutable'

import { GroupedMaterials, LeveledMaterials } from '../../lib/materials.service'

export const fakeCourse = '40003'

export const fakeUnleveledResource = {
  id: 10,
  year: '2122',
  course: fakeCourse,
  category: 'Misc',
  type: 'file',
  index: '0',
  path: 'cheatsheet.pdf',
  tags: ['exams'],
  title: 'Cheat sheet',
  uploader: 'adumble',
  visible_after: new Date(Date.UTC(2022, 9, 3)),
}

export const fakeLevel1Resource = {
  id: 8,
  year: '2122',
  course: fakeCourse,
  category: 'Tutorials',
  type: 'file',
  index: '0',
  path: 'propositional-logic.pdf',
  tags: ['Week 1'],
  title: 'Propositional Logic Slides',
  uploader: 'adumble',
  visible_after: new Date(Date.UTC(2022, 9, 3)),
}

export const fakeLevel2Resources = [
  {
    id: 5,
    year: '2122',
    course: fakeCourse,
    category: 'Lecture Notes',
    type: 'file',
    index: '1',
    path: 'first-order-logic.pdf',
    tags: ['Week 2'],
    title: 'First Order Logic Slides',
    uploader: 'adumble',
    visible_after: new Date(Date.UTC(2022, 9, 3)),
  },
  {
    id: 6,
    year: '2122',
    course: fakeCourse,
    category: 'Lecture Notes',
    type: 'file',
    index: '2',
    path: 'natural-deduction.pdf',
    tags: ['WEEK 2'],
    title: 'Natural Deduction Slides',
    uploader: 'adumble',
    visible_after: new Date(Date.UTC(2022, 9, 3)),
  },
]

export const fakeGroupedMaterials: GroupedMaterials = {
  Tutorials: [fakeLevel1Resource],
  'Lecture Notes': fakeLevel2Resources,
  Misc: [fakeUnleveledResource],
}

export const fakeLeveledMaterials: LeveledMaterials = [
  { Tutorials: [fakeLevel1Resource] },
  { 'Lecture Notes': fakeLevel2Resources },
]

export const fakeUnleveledMaterials: GroupedMaterials = { Misc: [fakeUnleveledResource] }

export const fakeRawMaterials = [fakeUnleveledResource, fakeLevel1Resource, ...fakeLevel2Resources]

export const mockLevelsManagerFactory = ({
  loaded = true,
  totalLevels = 1,
  level = 1,
  progress = 0,
  selectedLevel = 1,
  hasMinLevels = true,
  setSelectedLevel = (selectedLevel) => {},
  setTotalLevels = (totalLevels) => {},
  updateLevel = (leveledMaterials, completeResources) => {},
}: {
  loaded?: boolean
  totalLevels?: number
  level?: number
  progress?: number
  selectedLevel?: number
  hasMinLevels?: boolean
  setSelectedLevel?: (selectedLevel: number) => void
  setTotalLevels?: (totalLevels: number) => void
  updateLevel?: (
    leveledMaterials: LeveledMaterials,
    completeResources: Immutable.Set<number>
  ) => void
}) => ({
  loaded,
  totalLevels,
  level,
  progress,
  selectedLevel,
  hasMinLevels,
  setSelectedLevel: jest.fn(setSelectedLevel),
  setTotalLevels: jest.fn(setTotalLevels),
  updateLevel: jest.fn(updateLevel),
})
