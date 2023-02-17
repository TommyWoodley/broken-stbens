import { plainToInstance } from 'class-transformer'
import { useContext, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { LevelProgressBar } from '../components/game/LevelProgressBar'
import { endpoints } from '../constants/endpoints'
import { AxiosContext } from '../lib/axios.context'
import { useGame } from '../lib/game/game.context'
import { useLevels } from '../lib/game/levels.service'
import { useToast } from '../lib/toast.context'
import { Banner, Button, Container, Wrapper } from '../styles/_app.style'
import { css } from '../styles/stitches.config'
import { Module as ModuleType } from '../types/schemas/abc'

const Module = () => {
  const { gameSettingOn } = useGame()
  const { moduleCode } = useParams()
  const levelsManager = useLevels()
  const { pathname } = useLocation()
  const { year } = useParams()
  const axiosInstance = useContext(AxiosContext)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [module, setModule] = useState<ModuleType | undefined>(undefined)
  const [moduleIsLoaded, setModuleIsLoaded] = useState<boolean>(false)
  useEffect(() => {
    axiosInstance
      .request({
        url: endpoints.module(year!, moduleCode as string),
        method: 'GET',
      })
      .then(({ data }: { data: any }) => {
        if (!data) setModule(undefined)
        setModule(plainToInstance(ModuleType, data))
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error fetching module' })
        console.error(error)
      })
      .finally(() => setModuleIsLoaded(true))
  }, [addToast, axiosInstance, moduleCode, year])

  const tabs = [
    { title: 'Materials', to: 'materials' },
    { title: 'Exercises', to: 'exercises' },
  ]

  if (module === undefined) {
    return (
      <Container>
        <h1> {moduleCode}</h1>
        {moduleIsLoaded && (
          <Banner center>
            <span>Troubles loading data for this module. Please try refreshing.</span>
          </Banner>
        )}
      </Container>
    )
  }

  return (
    <Container>
      <Wrapper inline>
        <h1 style={{ width: '100%', margin: 0 }}> {module.title}</h1>
        {gameSettingOn &&
          RegExp('.*/materials').test(pathname) &&
          levelsManager.loaded &&
          levelsManager.hasMinLevels && (
            <LevelProgressBar level={levelsManager.level} levelProgress={levelsManager.progress} />
          )}
      </Wrapper>
      <h3
        className={css({
          color: '$lowContrast',
          margin: '0.5rem 0',
          marginBottom: '1rem',
          fontWeight: '400',
        })()}
      >
        {moduleCode}
      </h3>
      {/* TODO: Introduce module leader information or overview here when the data is available */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {tabs.map((tab) => (
          <Button
            key={tab.title}
            css={{ minWidth: '9rem', flex: '1 1 9rem', margin: 0 }}
            active={RegExp(`.*/${tab.to}`).test(pathname)}
            onClick={() => navigate(tab.to)}
            animate
          >
            {tab.title}
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', minHeight: '10rem', justifyContent: 'center' }}>
        <Outlet context={{ moduleCode, levelsManager }} />
      </div>
    </Container>
  )
}

export default Module
