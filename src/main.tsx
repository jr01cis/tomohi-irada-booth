import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/* No StrictMode: its double-mount in dev loses the WebGL context of the aurora and sweep canvases, which then fall back to CSS. */
createRoot(document.getElementById('root')!).render(<App />)
