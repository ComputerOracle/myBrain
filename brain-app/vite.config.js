import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['three', 'react', 'react-dom', '@react-three/fiber'],
  },
  optimizeDeps: {
    include: ['three', 'react', 'react-dom', '@react-three/fiber', '@react-three/postprocessing'],
  },
})
