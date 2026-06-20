import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: ['es2018', 'chrome63', 'firefox67', 'safari12', 'edge79'],
  },
})