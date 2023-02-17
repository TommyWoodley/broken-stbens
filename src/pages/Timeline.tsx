import { differenceInBusinessDays, differenceInCalendarWeeks, isMonday } from 'date-fns'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import { MainBackground } from '../components/timeline/MainBackground'
import { Modules } from '../components/timeline/Modules'
import { Switcher } from '../components/timeline/Switcher'
import { Tracks } from '../components/timeline/Tracks'
import { Weeks } from '../components/timeline/Weeks'
import cohortMappings from '../constants/cohortMappings'
import {
  INDEXING_OFFSET,
  NAVIGATION_HEIGHT,
  TIMELINE_DEFAULT_VIEW_LABEL,
} from '../constants/global'
import titles from '../constants/titles'
import { UseTimelineVars, useTimeline } from '../lib/timeline.service'
import { useUser } from '../lib/user.context'
import { Area, Container, Corner, Scrollbar, Thumb, Viewport } from '../styles/_app.style'

const COHORT_FILTER_LABELS = [TIMELINE_DEFAULT_VIEW_LABEL].concat(
  Object.entries(cohortMappings).map(([code, title]) => `${code}: ${title}`)
)
// differenceInCalendarWeeks returns number of weekends in between the 2 dates
export function dateToColumn(date: Date, startDate: Date): number {
  if (!isMonday(startDate)) throw new Error('Parameter startDate MUST be a monday.')
  if (date < startDate) return -1
  return (
    INDEXING_OFFSET +
    differenceInBusinessDays(date, startDate) +
    differenceInCalendarWeeks(date, startDate, { weekStartsOn: 1 })
  )
}

/* Top margin to position the scroll area 1rem right under the navigation bar */
const TOP_MARGIN = `(${NAVIGATION_HEIGHT})`

/* The timeline's laid out in four sections: switcher, weeks, modules and main grid. The main grid is a stack of three
 * components: events, indicator and rows; note that the layers are ordered based on their relative heights.
 */
const Timeline = () => {
  const { userDetails } = useUser()
  const {
    terms,
    term,
    modulesForTerm,
    trackMapForTerm,
    rowHeights,
    setTerm,
    setModulesCohortFilter,
  }: UseTimelineVars = useTimeline()
  const { year } = useParams()

  return (
    <>
      <Helmet>
        <title>{titles.timeline(year, term?.name, userDetails?.cohortName)}</title>
      </Helmet>
      {term ? (
        <>
          <Area
            css={{
              height: `calc(100vh - ${TOP_MARGIN})`,
              marginTop: `calc${TOP_MARGIN}`,
            }}
          >
            <Viewport>
              <Container timeline>
                <Switcher
                  term={term.name}
                  setTerm={setTerm}
                  terms={terms}
                  modulesCohortFilters={COHORT_FILTER_LABELS}
                  onModuleCohortFilterChange={setModulesCohortFilter}
                />
                <Weeks start={term.start} weeks={term.weeks} />
                <Modules modules={modulesForTerm} rowHeights={rowHeights} />
                <Tracks term={term} weeks={term.weeks} trackMap={trackMapForTerm} />
                <MainBackground cols={term.weeks} rowHeights={rowHeights} />
              </Container>
            </Viewport>
            <Scrollbar orientation="vertical">
              <Thumb />
            </Scrollbar>
            <Scrollbar orientation="horizontal">
              <Thumb />
            </Scrollbar>
            <Corner />
          </Area>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default Timeline
