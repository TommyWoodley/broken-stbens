import { useState } from 'react'
import { ChevronDoubleLeft, ChevronDoubleRight } from 'react-bootstrap-icons'
import { useNavigate, useParams } from 'react-router-dom'

import { formatShortYear, validShortYears } from '../lib/utilities.service'
import { YearArrow, YearSwitcherWrapper } from '../styles/navigation.style'

export const YearSwitcher = () => {
  const { year } = useParams()
  const navigate = useNavigate()

  const years = validShortYears()
  const [yearIndex, setYearIndex] = useState(
    years.findIndex((validYear) => validYear === year) ?? years.length - 1
  )

  const changeYear = (offset: -1 | 1) => {
    setYearIndex((index) => {
      const newIndex =
        offset === -1 ? Math.max(index - 1, 0) : Math.min(index + 1, years.length - 1)
      navigate('/' + years[newIndex] + window.location.pathname.slice(5))
      return newIndex
    })
  }

  return (
    <YearSwitcherWrapper>
      <YearArrow
        title="Previous academic year"
        onClick={() => changeYear(-1)}
        disabled={yearIndex <= 0}
      >
        <ChevronDoubleLeft size={20} />
      </YearArrow>
      <b>{formatShortYear(years[yearIndex])}</b>
      <YearArrow
        title="Next academic year"
        onClick={() => changeYear(+1)}
        disabled={yearIndex >= years.length - 1}
      >
        <ChevronDoubleRight size={20} />
      </YearArrow>
    </YearSwitcherWrapper>
  )
}
