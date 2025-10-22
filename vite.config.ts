import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base gets auto-updated by scripts/brand.mjs
export default defineConfig({
  plugins: [react()],
  base: '/<OldSchool-Woodworking-Cabinetry>/'
})
