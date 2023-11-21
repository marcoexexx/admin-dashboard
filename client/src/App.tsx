import { RouterProvider } from 'react-router-dom'
import { Providers } from "./components"
import { CustomChat } from 'react-facebook'
import routes from './pages/router'
import getConfig from './libs/getConfig'

function App() {
  return (
    <Providers>
      <RouterProvider router={routes} />
      <CustomChat pageId={getConfig("facebookPageId")} />
    </Providers>
  )
}

export default App
