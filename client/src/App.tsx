import { RouterProvider } from 'react-router-dom'
import { Providers, ToastProvider } from "./components"
import { CustomChat } from 'react-facebook'
import routes from './pages/router'
import getConfig from './libs/getConfig'


function App() {
  return (
    <Providers>
      <RouterProvider router={routes} />
      {import.meta.env.PROD && <CustomChat pageId={getConfig("facebookPageId")} />}
      <ToastProvider />
    </Providers>
  )
}

export default App
