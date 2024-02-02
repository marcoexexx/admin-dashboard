import { RouterProvider } from 'react-router-dom'
import { Providers, ToastProvider } from "./components"
import routes from './pages/router'
import UnderTheMaintenance from './pages/maintenance.page'


function App() {
  return (
    <Providers>
      {/* <RouterProvider router={routes} /> */}
      <UnderTheMaintenance />
      <ToastProvider />
    </Providers>
  )
}

export default App
