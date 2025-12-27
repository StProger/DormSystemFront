import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // слушать на 0.0.0.0 и ::, а не только 127.0.0.1
    port: 5173,
    strictPort: true,     // не прыгать на другой порт молча
    open: true,           // авто-открыть браузер
    hmr: { clientPort: 5173 },
  },
})
