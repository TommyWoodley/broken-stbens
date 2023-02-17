import confetti from 'canvas-confetti'
import { plainToInstance } from 'class-transformer'
import { useCallback, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { Exercise } from '../types/schemas/abc'
import { ExerciseSubmission } from '../types/schemas/emarking'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'

export const useExerciseForStudent = (exercise: Exercise) => {
  const axiosInstance = useContext(AxiosContext)
  const { year, moduleCode, exerciseNumber } = useParams()
  const { addToast } = useToast()

  const [submittedFiles, setSubmittedFiles] = useState<ExerciseSubmission[]>([])
  const loadSubmittedFiles = useCallback(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.submissions(year!, moduleCode!, parseInt(exerciseNumber!)),
      })
      .then(({ data }: { data: any }) => {
        setSubmittedFiles(
          data.map((submittedFile: any) => plainToInstance(ExerciseSubmission, submittedFile))
        )
      })
      .catch(() => {
        addToast({ variant: 'error', title: 'Error fetching submitted files' })
      })
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, year])

  const submitFile = (totalFilesToSubmit: number) => (file: File, targetFileName: string) => {
    let formData = new FormData()
    formData.append('file', new File([file], targetFileName))
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.submissions(year!, moduleCode!, parseInt(exerciseNumber!)),
        data: formData,
      })
      .then(({ data }: { data: ExerciseSubmission }) => {
        const submittedFile = plainToInstance(ExerciseSubmission, data)
        addToast({
          variant: 'success',
          title: `${targetFileName} submitted successfully.`,
        })
        if (totalFilesToSubmit === submittedFiles.length + 1) setTimeout(confetti, 330)
        setSubmittedFiles((prevFiles) => [
          ...prevFiles.filter((file) => file.targetFileName !== targetFileName),
          submittedFile,
        ])
      })
      .catch((error: any) => {
        addToast({
          variant: 'error',
          title: 'Error submitting file.',
        })
      })
  }

  const deleteFile = (file: ExerciseSubmission) => {
    axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.submission(year!, file.moduleCode, file.exerciseNumber, file.id),
      })
      .then(() => {
        addToast({ variant: 'info', title: `File deleted successfully.` })
        setSubmittedFiles((submittedFiles) =>
          submittedFiles.filter((submission) => submission.targetFileName !== file.targetFileName)
        )
      })
      .catch((error: any) => {
        addToast({ variant: 'error', title: "Can't delete submitted file" })
      })
  }

  const submitWorkload = (workload: string) => {
    if (workload === '') return
    axiosInstance.request({
      method: 'POST',
      url: endpoints.submissionWorkload(year!, moduleCode!, parseInt(exerciseNumber!)),
      params: { workload },
    })
  }

  return {
    submittedFiles,
    submitFile,
    deleteFile,
    submitWorkload,
    loadSubmittedFiles,
  }
}
