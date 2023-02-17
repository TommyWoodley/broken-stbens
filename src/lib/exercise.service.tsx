import { plainToInstance } from 'class-transformer'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { Exercise, ExerciseMaterials } from '../types/schemas/abc'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { useUser } from './user.context'

const defaultExerciseMaterials = {
  spec: null,
  dataFiles: [],
  modelAnswers: [],
  fileRequirements: [],
}

export const useExerciseMaterials = () => {
  const axiosInstance = useContext(AxiosContext)
  const { year, moduleCode, exerciseNumber } = useParams()
  const { addToast } = useToast()
  const { userDetails } = useUser()

  const [exerciseMaterials, setExerciseMaterials] =
    useState<ExerciseMaterials>(defaultExerciseMaterials)
  useEffect(() => {
    if (!userDetails) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.exerciseMaterials(
          year!,
          moduleCode!,
          parseInt(exerciseNumber!),
          userDetails.cohort
        ),
      })
      .then(({ data }: { data: any }) => {
        setExerciseMaterials(plainToInstance(ExerciseMaterials, data))
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to get exercise details' }))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, userDetails, year])

  return exerciseMaterials
}

export const useExercise = () => {
  const axiosInstance = useContext(AxiosContext)
  const { year, moduleCode, exerciseNumber } = useParams()
  const { addToast } = useToast()
  const [exercise, setExercise] = useState<Exercise>()
  const [exerciseIsLoaded, setExerciseIsLoaded] = useState<boolean>(false)
  useEffect(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.exercise(year!, moduleCode!, parseInt(exerciseNumber!)),
      })
      .then(({ data }: { data: any }) => {
        setExercise(plainToInstance(Exercise, data))
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to fetch exercise' }))
      .finally(() => setExerciseIsLoaded(true))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, year])

  return { exercise, exerciseIsLoaded }
}
