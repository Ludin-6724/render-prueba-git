import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function routeHtmlCopies(): Plugin {
  return {
    name: 'route-html-copies',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const index = path.join(dist, 'index.html')
      if (!fs.existsSync(index)) return
      const html = fs.readFileSync(index, 'utf8')
      for (const route of ['servicios', 'comercial', 'ongs', 'nosotros', 'contacto']) {
        const dir = path.join(dist, route)
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), html)
      }
      fs.writeFileSync(path.join(dist, '404.html'), html)
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), routeHtmlCopies()],
  server: {
    port: 3000,
    proxy: {
      '/contacto.php': {
        target: 'http://127.0.0.1:8088',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
