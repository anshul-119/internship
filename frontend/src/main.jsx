import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Mount main application instance inside React Strict Mode
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
