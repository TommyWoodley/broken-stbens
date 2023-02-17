import { HelmetProvider } from 'react-helmet-async'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthProtectedRoute } from '../components/AuthProtectedRoute'
import ExternalResource from '../components/ExternalResource'
import { YearRoute } from '../components/YearRoute'
import { baseURL } from '../constants/endpoints'
import { AxiosInstanceProvider } from '../lib/axios.context'
import { GameProvider, globalGameEnabled } from '../lib/game/game.context'
import { ThemeProvider } from '../lib/theme.context'
import { ToastProvider } from '../lib/toast.context'
import { UserProvider } from '../lib/user.context'
import { Area, Viewport as ScrollViewport, Scrollbar, Thumb } from '../styles/_app.style'
import { globalStyles } from '../styles/stitches.config'
import Analytics from './Analytics'
import Exercise from './Exercise'
import Exercises from './Exercises'
import Login from './Login'
import Materials from './Materials'
import Module from './Module'
import Modules from './Modules'
import Timeline from './Timeline'

function App() {
  globalStyles()
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <UserProvider>
            <AxiosInstanceProvider config={{ baseURL }}>
              <GameProvider>
                <Area>
                  <ScrollViewport>
                    {/* TODO: Add a no-match route (i.e. 404 Not Found) */}
                    <Login ></Login>
                  </ScrollViewport>
                  <Scrollbar orientation="vertical">
                    <Thumb />
                  </Scrollbar>
                </Area>
              </GameProvider>
            </AxiosInstanceProvider>
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
