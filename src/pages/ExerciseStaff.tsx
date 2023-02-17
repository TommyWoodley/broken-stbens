import Papa from 'papaparse'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MarkManagementArea } from '../components/exercise/MarkManagementArea'
import RawSubmissionsTable from '../components/tables/RawSubmissionsTable'
import featureEnabled from '../constants/betaHelpers'
import { endpoints } from '../constants/endpoints'
import { useExerciseForStaff } from '../lib/exerciseForStaff.service'
import { displayTimestamp } from '../lib/utilities.service'
import { AnchorButton } from '../styles/_app.style'
import { Deadline } from '../styles/exercise/exercise.style'
import { RawMarks } from '../types/global'
import { Exercise } from '../types/schemas/abc'
import { SubmissionDataRow } from '../types/tablesDataRows'

const ExerciseStaff = ({ exercise }: { exercise: Exercise }) => {
  const { year, moduleCode, exerciseNumber } = useParams()
  const {
    tableRows,
    lastSavedMarks,
    submissionsExist,
    setTableRows,
    updateTableWithMarks,
    postMarks,
    deleteMark,
  } = useExerciseForStaff(exercise)
  const [marksToSave, setMarksToSave] = useState<RawMarks>({})

  function marksFromRows(tableRowsRows: SubmissionDataRow[]): RawMarks {
    return tableRowsRows.reduce((acc, { login, mark, subRows }) => {
      return {
        ...acc,
        [login]: parseInt(`${mark}`),
        ...subRows?.reduce((subAcc, { login, mark }) => {
          return { ...subAcc, [login]: parseInt(`${mark}`) }
        }, {}),
      }
    }, {})
  }

  useEffect(() => {
    if (!lastSavedMarks) return
    setMarksToSave(
      Object.fromEntries(
        Object.entries(marksFromRows(tableRows)).filter(
          ([login, markInTable]) => !isNaN(markInTable) && markInTable !== lastSavedMarks[login]
        )
      ) as RawMarks
    )
  }, [lastSavedMarks, tableRows])

  function adjustedMark(mark: number, maxMark: number) {
    return Math.min(maxMark, Math.max(0, mark))
  }

  function loadMarksFromCSV(file: File) {
    file
      .text()
      .then((content) => {
        const { data, errors } = Papa.parse(content.trim(), { dynamicTyping: true })
        if (errors.length > 0) console.error(errors)
        else {
          let uploadedMarks = (data as [string, number][]).map(([login, mark]) => [
            login,
            adjustedMark(mark, exercise.maximumMark),
          ])
          updateTableWithMarks(Object.fromEntries(uploadedMarks))
        }
      })
      .catch((error) => {
        console.error('Failed to read CSV file:', error)
      })
  }

  function saveMarks(marks: RawMarks) {
    postMarks(marks).then(() => setMarksToSave({}))
  }

  function eraseMark(username: string) {
    return () => deleteMark(username)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Deadline>Due {displayTimestamp(exercise.deadline)}</Deadline>
        {submissionsExist && (
          <AnchorButton
            href={endpoints.submissionsZipped(
              year!,
              moduleCode!,
              parseInt(exerciseNumber as string)
            )}
            title="Download raw submissions"
          >
            Bulk download
          </AnchorButton>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {featureEnabled('marks', moduleCode!) && (
          <MarkManagementArea
            marksToSave={marksToSave}
            onMarkFileUpload={loadMarksFromCSV}
            onMarksSave={saveMarks}
          />
        )}
        <div style={{ overflowX: 'scroll' }}>
          <RawSubmissionsTable
            onDeleteMark={eraseMark}
            marksUpdateEnabled={featureEnabled('marks', moduleCode!)}
            exercise={exercise}
            data={tableRows}
            updateData={setTableRows}
          />
        </div>
      </div>
    </>
  )
}

export default ExerciseStaff
