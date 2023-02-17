import React, { createContext, useContext, useEffect, useState } from 'react'

import { endpoints } from '../../constants/endpoints'
import { AxiosContext } from '../axios.context'
import { useToast } from '../toast.context'
import { useUser } from '../user.context'

type GameProviderType = {
  gameSettingOn: boolean
  toggleGameSetting: () => void
}

const defaultGame: GameProviderType = {
  gameSettingOn: false,
  toggleGameSetting: () => {},
}

export const globalGameEnabled = process.env.REACT_APP_GAMIFICATION === 'on'

export const GameContext = createContext<GameProviderType>(defaultGame)

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameSettingOn, setGameSettingOn] = useState(defaultGame.gameSettingOn)

  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()
  const { userDetails } = useUser()

  useEffect(() => {
    /* We do not include game levels for staff as it may be unintuitive when uploading files */
    if (globalGameEnabled && userDetails && !userDetails.isStaff) {
      axiosInstance
        .request({
          method: 'GET',
          url: endpoints.gameSetting,
        })
        .then(({ data }) => {
          if ('game_enabled' in data) {
            setGameSettingOn(data.game_enabled)
          }
        })
        .catch((error) => {
          addToast({ variant: 'error', title: 'Error fetching game settings' })
          console.error(error)
        })
    }
  }, [addToast, axiosInstance, userDetails])

  const toggleGameSetting = async () => {
    if (userDetails?.isStaff) throw new Error('Staff should NOT toggle game levels')
    axiosInstance
      .request({
        method: 'PUT',
        url: endpoints.gameSetting,
        data: { game_enabled: !gameSettingOn },
      })
      .then(() => {
        setGameSettingOn(!gameSettingOn)
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error toggling game setting' })
        console.error(error)
      })
  }

  return (
    <GameContext.Provider value={{ gameSettingOn, toggleGameSetting }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
