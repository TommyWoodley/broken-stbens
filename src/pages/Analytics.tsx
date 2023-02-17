import { plainToInstance } from 'class-transformer'
import { formatISO, subDays } from 'date-fns'
import { useContext, useEffect, useMemo, useState } from 'react'
import { GraphUpArrow, Trophy } from 'react-bootstrap-icons'
import { useParams } from 'react-router-dom'

import { ModuleRanking } from '../components/game/ModuleRanking'
import { PlayersProgressCircle } from '../components/game/PlayersProgressCircle'
import { StudentProgressLineChart } from '../components/game/StudentProgressLineChart'
import { Statistic } from '../components/statistics/Statistic'
import { NumberedAward, NumberedCircle } from '../components/statistics/numberedIcons'
import { endpoints } from '../constants/endpoints'
import { AxiosContext } from '../lib/axios.context'
import { useRecentAcademicTerm } from '../lib/terms.service'
import { useToast } from '../lib/toast.context'
import { useUser } from '../lib/user.context'
import { capitalizeEachWord, now, shortYear } from '../lib/utilities.service'
import { Banner, Container } from '../styles/_app.style'
import { Grid } from '../styles/statistics/analytics.style'
import { DatedModuleMeanCompletions, ModuleMeanCompletion } from '../types/schemas/gamification'

const AFFILIATED_COMPLETIONS_RESULTS_LIMIT = 3
const OVERALL_COMPLETIONS_RESULTS_LIMIT = 10
const DATED_MODULES_RESULTS_LIMIT = 3
const RECENT_DAYS = 30

const Analytics = () => {
  const { term, termIndex } = useRecentAcademicTerm()
  const { userDetails } = useUser()
  const { year } = useParams()

  const personalModuleCodes = useMemo(
    () => userDetails?.modules.map((module) => module.code),
    [userDetails]
  )

  if (shortYear() !== year!) {
    return (
      <Container>
        <Banner center>
          {/**
           * This would not be too difficult to support:
           * Add a term switcher, update endpoint params accordingly, and update fake dev data.
           */}
          <span>Analytics for non-current years are unsupported.</span>
        </Banner>
      </Container>
    )
  }

  if (!(personalModuleCodes && term)) {
    return <></>
  }

  return (
    <Container css={{ marginBottom: '2rem' }}>
      <h1>{`${capitalizeEachWord(term.name)} Analytics`}</h1>
      <Grid>
        <PlayersProgressCircle />

        {userDetails?.isStaff ? (
          <StaffAnalytics
            termStart={term.start}
            termIndex={termIndex}
            personalModuleCodes={personalModuleCodes}
          />
        ) : (
          <StudentAnalytics
            termStart={term.start}
            termIndex={termIndex}
            personalModuleCodes={personalModuleCodes}
          />
        )}
      </Grid>
    </Container>
  )
}

const StudentAnalytics = ({
  termStart,
  termIndex,
  personalModuleCodes,
}: {
  termStart: Date
  termIndex: number
  personalModuleCodes: string[]
}) => {
  const moduleCompletions = useModuleCompletions(
    termIndex,
    AFFILIATED_COMPLETIONS_RESULTS_LIMIT,
    personalModuleCodes
  )
  const recentCompletions = useRecentModuleCompletions(termIndex, personalModuleCodes)

  return (
    <>
      <Statistic title="Most Complete Modules" Icon={GraphUpArrow} gridColumns={2}>
        <ModuleRanking
          NumberedIcon={NumberedAward}
          iconSize={28}
          moduleCompletions={moduleCompletions}
        />
      </Statistic>

      <Statistic title="Recently Popular Modules" gridColumns={3}>
        <StudentProgressLineChart termStart={termStart} recentCompletions={recentCompletions} />
      </Statistic>
    </>
  )
}

const StaffAnalytics = ({
  termStart,
  termIndex,
  personalModuleCodes,
}: {
  termStart: Date
  termIndex: number
  personalModuleCodes: string[]
}) => {
  const affiliatedModuleCompletions = useModuleCompletions(
    termIndex,
    AFFILIATED_COMPLETIONS_RESULTS_LIMIT,
    personalModuleCodes
  )

  const allModuleCompletions = useModuleCompletions(termIndex, OVERALL_COMPLETIONS_RESULTS_LIMIT)
  const recentCompletions = useRecentModuleCompletions(termIndex)

  return (
    <>
      <Statistic title="My Most Complete Modules" Icon={GraphUpArrow} gridColumns={2}>
        <ModuleRanking
          NumberedIcon={NumberedCircle}
          moduleCompletions={affiliatedModuleCompletions}
          showCompletion
        />
      </Statistic>

      <Statistic title="Recently Popular Modules" gridColumns={3}>
        <StudentProgressLineChart termStart={termStart} recentCompletions={recentCompletions} />
      </Statistic>

      <Statistic title="Overall Most Complete Modules" Icon={Trophy} gridColumns={3}>
        <ModuleRanking
          NumberedIcon={NumberedAward}
          iconSize={28}
          moduleCompletions={allModuleCompletions}
          showCompletion
        />
      </Statistic>
    </>
  )
}

function useModuleCompletions(
  termIndex: number,
  resultsLimit: number,
  moduleCodes?: string[]
): ModuleMeanCompletion[] {
  const [moduleCompletions, setModuleCompletions] = useState<ModuleMeanCompletion[]>([])

  const { year } = useParams()
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()

  useEffect(() => {
    if (year) {
      axiosInstance
        .request({
          method: 'GET',
          url: endpoints.moduleCompletions(year),
          params: { term: termIndex, module_codes: moduleCodes, results_limit: resultsLimit },
        })
        .then(({ data }) =>
          setModuleCompletions(plainToInstance(ModuleMeanCompletion, data as any[]))
        )
        .catch((error: any) => {
          addToast({
            variant: 'error',
            title: 'Error fetching mean module completion',
          })
        })
    }
  }, [addToast, axiosInstance, year, termIndex, resultsLimit, moduleCodes])

  return moduleCompletions
}

function useRecentModuleCompletions(
  termIndex: number,
  moduleCodes?: string[]
): DatedModuleMeanCompletions[] {
  const [recentCompletions, setRecentCompletions] = useState<DatedModuleMeanCompletions[]>([])

  const { year } = useParams()
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()

  useEffect(() => {
    if (year) {
      axiosInstance
        .request({
          method: 'GET',
          url: endpoints.moduleDatedCompletions(year),
          params: {
            start_date: formatISO(subDays(now(), RECENT_DAYS), { representation: 'date' }),
            term: termIndex,
            module_codes: moduleCodes,
            modules_limit: DATED_MODULES_RESULTS_LIMIT,
          },
        })
        .then(({ data }) =>
          setRecentCompletions(plainToInstance(DatedModuleMeanCompletions, data as any[]))
        )
        .catch((error: any) => {
          addToast({
            variant: 'error',
            title: 'Error fetching recently popular modules',
          })
        })
    }
  }, [addToast, axiosInstance, year, termIndex, moduleCodes])

  return recentCompletions
}

export default Analytics
