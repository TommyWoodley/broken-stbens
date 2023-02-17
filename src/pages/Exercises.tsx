import { plainToInstance } from 'class-transformer'
import { Fragment, useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import { Tabs } from '../components/Tabs'
import { endpoints } from '../constants/endpoints'
import titles from '../constants/titles'
import { AxiosContext } from '../lib/axios.context'
import { useToast } from '../lib/toast.context'
import { useUser } from '../lib/user.context'
import { calculateGrade, displayTimestamp, now, percentage } from '../lib/utilities.service'
import { Banner } from '../styles/_app.style'
import { Link, LinkIcon } from '../styles/exercise/exercise.style'
import {
  Header,
  HorizontalRow,
  SubText,
  Table,
  ViewExerciseButton,
} from '../styles/exercise/exercisesPage.style'
import { styleExerciseItem } from '../styles/exerciseItem.style'
import { Exercise } from '../types/schemas/abc'
import { Feedback } from '../types/schemas/emarking'

const Exercises = () => {
  const axiosInstance = useContext(AxiosContext)
  const { year } = useParams()
  const { addToast } = useToast()
  const { userDetails } = useUser()
  const { moduleCode } = useParams()
  const moduleTitle = userDetails?.associatedModules.find((m) => m.code === moduleCode)?.title

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [feedbackLookup, setFeedbackLookup] = useState<{ [exercise: number]: Feedback }>({})

  useEffect(() => {
    axiosInstance
      .request({
        url: endpoints.exercises(year!),
        method: 'GET',
        params: { module_code: moduleCode },
      })
      .then(({ data }: { data: any }) => {
        if (data === null) setExercises([])
        setExercises(
          data
            .map((exercise: any) => plainToInstance(Exercise, exercise))
            .sort((ex1: Exercise, ex2: Exercise) => ex1.deadline.getTime() - ex2.deadline.getTime())
        )
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error fetching exercises' })
        console.error(error)
      })
  }, [addToast, axiosInstance, moduleCode, year])

  useEffect(() => {
    axiosInstance
      .request({
        url: endpoints.feedback(year!),
        method: 'GET',
        params: { module_code: moduleCode },
      })
      .then(({ data }: { data: any }) => {
        if (data === null) setFeedbackLookup([])
        setFeedbackLookup(
          data
            .map((feedback: any) => plainToInstance(Feedback, feedback))
            .reduce(
              (exerciseToFeedback: { [exercise: number]: Feedback }, feedback: Feedback) => ({
                ...exerciseToFeedback,
                [feedback['exerciseNumber']]: feedback,
              }),
              {}
            )
        )
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error fetching feedback' })
        console.error(error)
      })
  }, [addToast, axiosInstance, exercises, moduleCode, year])

  const ExercisesTable = () => (
    <Table>
      <thead style={{ textAlign: 'left' }}>
        <tr>
          <Header>Exercise</Header>
          <Header colSpan={3}>Mark</Header>
        </tr>
      </thead>
      <tbody>
        {exercises.map((e: Exercise) => (
          <Fragment key={e.number}>
            <HorizontalRow colSpan={4} />
            <tr>
              <td>
                <ViewExerciseButton
                  disabled={e.startDate > now()}
                  href={e.startDate <= now() ? `${window.location.pathname}/${e.number}` : '#'}
                  title="View exercise details"
                  css={styleExerciseItem(e)}
                >
                  <p>
                    {e.type} {e.number}: {e.title}
                  </p>
                  <SubText>{displayTimestamp(e.deadline)}</SubText>
                </ViewExerciseButton>
              </td>

              <td>{e.mark ? <b>{calculateGrade(e.mark, e.maximumMark)}</b> : <p>n/a</p>}</td>

              <td style={{ whiteSpace: 'nowrap' }}>
                {e.mark && (
                  <>
                    {percentage(e.mark, e.maximumMark)}
                    <br />
                    <SubText>
                      {e.mark} / {e.maximumMark}
                    </SubText>
                  </>
                )}
              </td>

              {e.mark && e.number in feedbackLookup && (
                <td>
                  <Link
                    css={{ fontSize: '$md' }}
                    target="_blank"
                    href={endpoints.feedbackFile(feedbackLookup[e.number].id)}
                    title={`Feedback for ${e.title}`}
                  >
                    <LinkIcon />
                    Feedback
                  </Link>
                </td>
              )}
            </tr>
          </Fragment>
        ))}
      </tbody>
    </Table>
  )

  const ExercisesList = () => (
    <div style={{ flexGrow: 1 }}>
      <Tabs
        data={exercises}
        generator={(exercise: Exercise) => (
          <>
            <span>
              {exercise.type} {exercise.number}: {exercise.title}
            </span>
          </>
        )}
        href={(exercise) => `/${year}/modules/${exercise.moduleCode}/exercises/${exercise.number}`}
      />
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{titles.exercises(year, moduleCode, moduleTitle)}</title>
      </Helmet>
      {exercises.length === 0 ? (
        <Banner center>No exercises to show</Banner>
      ) : userDetails?.isStaff || userDetails?.isTaForModule(moduleCode!) ? (
        <ExercisesList />
      ) : (
        <ExercisesTable />
      )}
    </>
  )
}

export default Exercises
