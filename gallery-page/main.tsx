import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GalleryPage } from './GalleryPage.tsx'
import '../src/index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element was not found.')
}

createRoot(rootElement).render(
  <StrictMode>
    <GalleryPage />
  </StrictMode>,
)
