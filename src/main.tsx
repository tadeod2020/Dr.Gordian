import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Offline fallback: if a remote image (e.g. pet avatar) can't load, show a local paw placeholder
const OFFLINE_IMG_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#dbeafe"/><g fill="#2563eb"><ellipse cx="50" cy="64" rx="17" ry="14"/><circle cx="30" cy="44" r="7"/><circle cx="43" cy="33" r="7"/><circle cx="57" cy="33" r="7"/><circle cx="70" cy="44" r="7"/></g></svg>'
  )
document.addEventListener(
  'error',
  (e) => {
    const el = e.target
    if (el instanceof HTMLImageElement && /^https?:/.test(el.src) && el.dataset.offlineFallback !== '1') {
      el.dataset.offlineFallback = '1'
      el.src = OFFLINE_IMG_PLACEHOLDER
    }
  },
  true
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
