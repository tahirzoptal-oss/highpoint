import './index.css'
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App.jsx'

// vite-react-ssg entry. Exports `createRoot` instead of calling it, so the build
// can server-render every route to static HTML at build time and hydrate on the
// client. This is what makes the shipped HTML crawlable (real <a href>, real
// per-route <head>) instead of an empty SPA shell.
export const createRoot = ViteReactSSG({ routes })
