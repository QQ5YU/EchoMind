import { Providers } from './providers'
import { AppRouter } from './routers/AppRouter'
import { useTheme } from '@features/settings/hooks/useTheme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  useTheme()

  return (
    <Providers>
      <ToastContainer position="top-right" autoClose={5000} />
      <AppRouter />
    </Providers>
  )
}

export default App