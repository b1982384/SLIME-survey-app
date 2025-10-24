import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import "@fontsource/inter";
import "@fontsource/archivo-black";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/space-grotesk/700.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
