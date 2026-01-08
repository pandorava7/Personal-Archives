import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import path from "path";
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    sitemap({
      hostname: 'https://www.pandorava7.com',
      // 这里列出你所有的静态页面路由
      dynamicRoutes: [
        '/post/Arcaea%E6%96%B0%E6%9B%B2%E9%80%9F%E9%80%92%EF%BC%81%E5%A4%A9%E6%89%8D%E5%B0%91%E5%A5%B3%E4%B8%8EGlitch%E7%94%B5%E9%9F%B3',
        // 后续有新文章直接往这个数组里加
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    // 这里的 global 会被替换为 window，从而自动挂载 Buffer
    'global': 'window',
  },
})
