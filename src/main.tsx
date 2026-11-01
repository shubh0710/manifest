import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/ibm-plex-sans'
import '@fontsource/ibm-plex-mono'
import '@fontsource/ibm-plex-mono/500.css'
import './index.css'
import App from './App.tsx'
import CasesProvider from './context/CasesProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CasesProvider>
        <App />
      </CasesProvider>
    </BrowserRouter>
  </StrictMode>,
)
