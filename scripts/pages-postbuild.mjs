// GitHub Pages serves files only: no rewrites, so a deep link like
// /Restaurant/menu would 404 before React boots. Copying index.html to 404.html
// hands those requests to the SPA router instead.
import { copyFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist', import.meta.url))

copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
// Keeps GitHub from running the build output through Jekyll.
writeFileSync(join(dist, '.nojekyll'), '')
