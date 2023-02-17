import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'

import { groupByProperty } from '../../lib/utilities.service'
import { Wrapper } from '../../styles/_app.style'
import { TermSwitchArrow } from '../../styles/timeline/switcher.style'
import { Term } from '../../types/schemas/abc'
import { SelectBox } from '../Select'

export const Switcher = ({
  term,
  setTerm,
  terms,
  modulesCohortFilters,
  onModuleCohortFilterChange,
}: {
  term: string
  setTerm: (_: Term) => void
  terms: Term[]
  modulesCohortFilters: string[]
  onModuleCohortFilterChange: (_: string) => void
}) => {
  const periods = Object.keys(groupByProperty(terms, 'name', 'start'))
  const [periodIndex, setPeriodIndex] = useState(periods.findIndex((p) => p === term))
  const [moduleFilterIndex, setModuleFilterIndex] = useState(0)

  useEffect(() => {
    setTerm(terms.find((term) => term.name === periods[periodIndex]) || terms[0])
  }, [periodIndex, periods, setTerm, terms])

  useEffect(() => {
    onModuleCohortFilterChange(modulesCohortFilters[moduleFilterIndex].split(':')[0])
  }, [moduleFilterIndex, modulesCohortFilters, onModuleCohortFilterChange, setTerm, terms])

  const TermSwitcher = () => {
    return (
      <Wrapper
        css={{
          gridArea: 'switcher',
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          verticalAlign: 'middle',
          padding: '0 0.5rem 0 0.5rem',
        }}
      >
        <TermSwitchArrow
          title="Previous academic period"
          onClick={() => setPeriodIndex((index) => Math.max(index - 1, 0))}
          disabled={periodIndex <= 0}
        >
          <ChevronLeft size={20} />
        </TermSwitchArrow>

        <SelectBox
          title="academic_period"
          items={periods}
          display={(p) =>
            p
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          }
          defaultValue={periodIndex.toString()}
          onSelect={(newIndex) => setPeriodIndex(parseInt(newIndex))}
          value={periodIndex.toString()}
        />

        <TermSwitchArrow
          title="Next academic period"
          onClick={() => setPeriodIndex((index) => Math.min(index + 1, periods.length - 1))}
          disabled={periodIndex >= periods.length - 1}
        >
          <ChevronRight size={20} />
        </TermSwitchArrow>
      </Wrapper>
    )
  }

  const CohortViewSwitcher = () => {
    return (
      <Wrapper
        css={{
          display: 'flex',
          padding: '0 0.5rem 0 0.5rem',
        }}
      >
        <SelectBox
          title="Module Filters"
          items={modulesCohortFilters}
          defaultValue={moduleFilterIndex.toString()}
          onSelect={(newIndex) => setModuleFilterIndex(parseInt(newIndex))}
          value={moduleFilterIndex.toString()}
        />
      </Wrapper>
    )
  }

  return (
    <Wrapper
      css={{
        gridArea: 'switcher',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'center',
        position: 'sticky',
        zIndex: 5,
        paddingTop: '1rem',
        background: '$appBackground',
        borderRight: '1px solid $elementBorder',
        top: 0,
        left: 0,
      }}
    >
      <TermSwitcher />
      <CohortViewSwitcher />
    </Wrapper>
  )
}
