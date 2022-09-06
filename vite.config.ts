import { defineConfig } from 'vite'
import * as path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/editor.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['monaco-editor'],
    },
  },
})
