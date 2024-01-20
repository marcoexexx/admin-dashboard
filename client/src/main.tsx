import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import show_bannar from './libs/show_bannar.ts'


show_bannar()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
