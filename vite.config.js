import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Build clock, frozen into BOTH the SSG render and the browser bundle.
    //
    // Scheduled blog posts (src/lib/publishing.js) are gated against this one
    // value rather than a live Date.now(), so the prerendered HTML and the
    // hydrating client always resolve the same set of published posts — no
    // hydration mismatch, and no listing card that links to a detail page the
    // build never generated. A scheduled post goes live on the first build at
    // or after its publishedAt instant.
    //
    // Set BUILD_TIME to an ISO instant to preview the site as it will look on a
    // future date, e.g. `BUILD_TIME=2026-08-07T17:00:00Z npm run dev`.
    __BUILD_TIME__: JSON.stringify(process.env.BUILD_TIME || new Date().toISOString()),
  },
})
