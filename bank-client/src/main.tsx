import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
/*<script src="https://cdn.tailwindcss.com"></script>*/


// 下面如果演示功能请切换到 AppStarting.tsx
import App from './AppStarting2.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
