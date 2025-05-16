import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
/*<script src="https://cdn.tailwindcss.com"></script>*/
import App from './AppStarting.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
