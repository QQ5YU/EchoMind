import { Providers } from './providers'
import { AppRouter } from './routers/AppRouter'
import { useTheme } from '@features/settings/hooks/useTheme'

function App() {
  useTheme()

  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}

export default App
