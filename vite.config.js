import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@mui/x-date-pickers/AdapterDayjs": path.resolve(
        __dirname,
        "node_modules/@mui/x-date-pickers/AdapterDayjs/AdapterDayjs.js"
      ),
    },
  },
})
