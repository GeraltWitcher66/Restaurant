import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `vite build --mode pages` produces a purely static build for GitHub Pages:
// no Worker (Pages serves files only), a repo-scoped base path, and the
// in-browser fallback for the form routes.
export default defineConfig(({ mode }) => {
  const pages = mode === 'pages'
  return {
    base: pages ? '/Restaurant/' : '/',
    define: pages ? { 'import.meta.env.VITE_STATIC_API': '"true"' } : undefined,
    plugins: [react(), tailwindcss(), ...(pages ? [] : [cloudflare()])],
    server: { port: 5309, strictPort: false },
  }
})
