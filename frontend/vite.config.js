import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Garante que aceite conexões externas ao container
    watch: {
      usePolling: true, // ESSENCIAL: faz o Vite checar mudanças por tempo
    },
    proxy: {
      '/api': {
        target: 'http://backend:8000', // DICA: use o nome do serviço 'backend' do docker-compose
        changeOrigin: true,
        // Removi o rewrite se sua API já espera o prefixo /api
      }
    }
  }
})