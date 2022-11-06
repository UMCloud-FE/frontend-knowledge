import { defineConfig } from 'dumi';

export default defineConfig({
  title: '前端知识体系库',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  history: {
    type: 'browser',
  },
  outputPath: 'dist',
  mode: 'doc',
  base: '/docs/',
  publicPath: '/docs/',
  exportStatic: {},
  404: true,
  resolve: {
    includes: ['docs'],
  },
  targets: {
    ie: 11,
  },
  styles: [``]
});
