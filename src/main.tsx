import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/styles/fonts.css'
import App from './App.tsx'
import "./i18n";
import { BrowserRouter } from 'react-router-dom'
import { FlashMessageProvider } from './components/FlashMessageContext/FlashMessageContext.tsx'
import { MusicProvider } from './components/AudioContext/AudioContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FlashMessageProvider>
        <MusicProvider>
          <App />
        </MusicProvider>
      </FlashMessageProvider>
    </BrowserRouter>
  </StrictMode>
)
