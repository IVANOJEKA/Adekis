import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Trigger restart
export default defineConfig({
  plugins: [react()],
})
