import { useContext, useEffect, useState } from 'react'
import { People } from 'react-bootstrap-icons'
import { useParams } from 'react-router-dom'

import { endpoints } from '../../constants/endpoints'
import { AxiosContext } from '../../lib/axios.context'
import { useToast } from '../../lib/toast.context'
import { ProgressCircle } from '../statistics/ProgressCircle'
import { Statistic } from '../statistics/Statistic'

export const PlayersProgressCircle = () => {
  const [players, setPlayers] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)

  const { year } = useParams()
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()

  useEffect(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.players,
      })
      .then(({ data }) => setPlayers(data.total))
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error fetching total game players' })
        console.error(error)
      })
  }, [addToast, axiosInstance])

  useEffect(() => {
    if (year) {
      axiosInstance
        .request({
          method: 'GET',
          url: endpoints.enrolments(year),
        })
        .then(({ data }) => setTotalStudents(data.total))
        .catch((error) => {
          addToast({ variant: 'error', title: 'Error fetching total students' })
          console.error(error)
        })
    }
  }, [addToast, axiosInstance, year])

  return (
    <Statistic title="Players" Icon={People}>
      <ProgressCircle
        numerator={players}
        denominator={totalStudents}
        textFormatter={(numerator) => `${numerator} total`}
      />
    </Statistic>
  )
}
