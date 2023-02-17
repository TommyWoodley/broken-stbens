import { plainToInstance } from 'class-transformer'
import { format } from 'date-fns'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { Mapping, RawMarks } from '../types/global'
import { EnrolledStudent, Exercise } from '../types/schemas/abc'
import { ExerciseSubmission, Group, Mark } from '../types/schemas/emarking'
import { SubmissionDataRow } from '../types/tablesDataRows'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { useUser } from './user.context'
import { groupByProperty } from './utilities.service'

const DATA_PLACEHOLDER_VALUE = '-'
const EMPTY_CELL_VALUE = ''

export const useExerciseForStaff = (exercise: Exercise) => {
  const axiosInstance = useContext(AxiosContext)
  const { year, moduleCode, exerciseNumber } = useParams()
  const { addToast } = useToast()
  const { userDetails } = useUser()

  const [studentLookup, setStudentLookup] = useState<Mapping<string, EnrolledStudent>>()
  useEffect(() => {
    if (!userDetails) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.enrolledStudents(year!, moduleCode!),
      })
      .then(({ data }: { data: any }) => {
        let enrolled = data.map((d: any) => plainToInstance(EnrolledStudent, d))
        setStudentLookup(
          enrolled.reduce((acc: Mapping<string, EnrolledStudent>, student: EnrolledStudent) => {
            return { ...acc, [student.login]: student }
          }, {})
        )
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to get enrolled students' }))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, userDetails, year])

  const [submissionLookup, setSubmissionLookup] = useState<Mapping<string, ExerciseSubmission[]>>()
  useEffect(() => {
    if (!userDetails) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.submissionsForStaff(year!, moduleCode!, parseInt(exerciseNumber!)),
      })
      .then(({ data }: { data: any }) => {
        let deserialisedData = data.map((d: any) => plainToInstance(ExerciseSubmission, d))
        setSubmissionLookup(
          groupByProperty(deserialisedData, 'username', 'timestamp') as {
            [username: string]: ExerciseSubmission[]
          }
        )
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to get student submissions' }))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, userDetails, year])

  const [submissionsExist, setSubmissionsExist] = useState<boolean>(false)
  useEffect(() => {
    setSubmissionsExist(Object.keys(studentLookup || {}).length !== 0)
  }, [studentLookup])

  const [groupLookup, setGroupLookup] = useState<Mapping<string, Group>>()
  useEffect(() => {
    if (!userDetails) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.submissionGroups,
        params: {
          year,
          module_code: moduleCode,
          exercise_number: exerciseNumber,
        },
      })
      .then(({ data }: { data: any }) => {
        const deserialised = data.map((d: any) => plainToInstance(Group, d))
        const groupsByLeader = deserialised.reduce(
          (grouped: Mapping<string, Group>, group: Group) => {
            return { ...grouped, [group.leader as string]: group }
          },
          {}
        )
        setGroupLookup(groupsByLeader)
      })
      .catch((error) => {
        console.log(error)
        addToast({ variant: 'error', title: 'Failed to fetch groups' })
      })
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, userDetails, year])

  const getMarks = useCallback(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.marks(year!, moduleCode!, parseInt(exerciseNumber!)),
      })
      .then(({ data }: { data: any }) => {
        let deserialised = data.map((d: any) => plainToInstance(Mark, d))
        setMarksLookup(
          deserialised.reduce((grouped: Mapping<string, Mark>, mark: Mark) => {
            return { ...grouped, [mark.student_username]: mark.mark }
          }, {})
        )
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to get marks' }))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, year])

  function postMarks(marks: Mapping<string, number>) {
    return axiosInstance
      .request({
        method: 'POST',
        url: endpoints.marks(year!, moduleCode!, parseInt(exerciseNumber!)),
        data: Object.entries(marks).map(([login, mark]) => {
          return { student_username: login, mark: mark }
        }),
      })
      .then(() => {
        getMarks()
        addToast({ variant: 'success', title: 'Marks saved!' })
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to post marks' }))
  }

  const [marksLookup, setMarksLookup] = useState<Mapping<string, number>>()
  useEffect(() => {
    if (!userDetails) return
    getMarks()
  }, [addToast, axiosInstance, exerciseNumber, getMarks, moduleCode, userDetails, year])

  const [tableRows, setTableRows] = useState<SubmissionDataRow[]>([])
  useEffect(() => {
    if (marksLookup === undefined) return
    if (studentLookup === undefined) return
    if (groupLookup === undefined) return
    if (submissionLookup === undefined) return

    const members = new Set(
      Object.values(groupLookup)
        .flatMap((g) => g.members)
        .filter((m) => !m.isLeader)
        .map((m) => m.username)
    )
    const submitters = new Set(Object.keys(submissionLookup))

    let missing: Mapping<string, ExerciseSubmission[]> = Object.keys(studentLookup)
      .filter((s) => !(members.has(s) || submitters.has(s)))
      .reduce((acc, login) => {
        return { ...acc, [login]: [] }
      }, {})

    const fullDataEntries = { ...submissionLookup, ...missing }
    const rows = Object.entries(fullDataEntries).map(([leader, submissions]) => {
      let mark = marksLookup[leader]
      return {
        login: leader,
        fullName: studentLookup[leader]?.fullName || DATA_PLACEHOLDER_VALUE,
        latestSubmission:
          submissions.length > 0
            ? format(submissions[submissions.length - 1].timestamp, 'dd/MM/yy HH:mm:ss')
            : DATA_PLACEHOLDER_VALUE,
        mark: !isNaN(mark) ? mark : EMPTY_CELL_VALUE,
        subRows:
          groupLookup[leader]?.members
            .filter((m) => !m.isLeader)
            .map(({ username }) => {
              let mark = marksLookup[username]
              return {
                login: username,
                fullName: studentLookup[username]?.fullName || DATA_PLACEHOLDER_VALUE,
                latestSubmission: DATA_PLACEHOLDER_VALUE,
                mark: !isNaN(mark) ? mark : EMPTY_CELL_VALUE,
              }
            }) || [],
      }
    })

    setTableRows(rows)
  }, [marksLookup, groupLookup, studentLookup, submissionLookup])

  function updateTableWithMarks(marks: RawMarks) {
    setTableRows((old: SubmissionDataRow[]) => {
      return old.map((r: SubmissionDataRow) => {
        if (r.login in marks) {
          const leaderMark = marks[r.login]
          return {
            ...r,
            mark: leaderMark,
            subRows: r.subRows?.map((subRow) => {
              return {
                ...subRow,
                mark: subRow.login in marks ? marks[subRow.login] : leaderMark,
              }
            }),
          }
        }
        return r
      })
    })
  }

  function deleteMark(username: string) {
    return axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.mark(year!, moduleCode!, parseInt(exerciseNumber!), username),
      })
      .then(() => {
        getMarks()
        addToast({ variant: 'success', title: 'Mark deleted' })
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to delete mark' }))
  }

  return {
    tableRows,
    lastSavedMarks: marksLookup,
    submissionsExist,
    setTableRows,
    postMarks,
    deleteMark,
    updateTableWithMarks,
  }
}
