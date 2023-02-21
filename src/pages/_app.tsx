import { HelmetProvider } from 'react-helmet-async'

import { ThemeProvider } from '../lib/theme.context'
import { ToastProvider } from '../lib/toast.context'
import { Area, Viewport as ScrollViewport, Scrollbar, Thumb } from '../styles/_app.style'
import { globalStyles } from '../styles/stitches.config'
import Login from './Login'

function App() {
  globalStyles()
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <Area>
            <ScrollViewport>
              <Login ></Login>
            </ScrollViewport>
            <Scrollbar orientation="vertical">
              <Thumb />
            </Scrollbar>
          </Area>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
