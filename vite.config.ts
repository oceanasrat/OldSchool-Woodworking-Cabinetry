import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site
export default defineConfig({
  plugins: [react()],
  base: '/OldSchool-Woodworking-Cabinetry/',
})

