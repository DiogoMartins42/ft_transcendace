import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // or host: '0.0.0.0'
  },
  plugins: [
	tailwindcss()
],
})