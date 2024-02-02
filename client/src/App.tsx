import { RouterProvider } from 'react-router-dom'
import { Providers, ToastProvider } from "./components"
import routes from './pages/router'


function App() {
  return (
    <Providers>
      <RouterProvider router={routes} />
      <ToastProvider />
    </Providers>
  )
}

export default App
