import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: '知识库',
    logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
    nav: [
      { title: '前端基础', link: '/base' },
      { title: '前端工程化', link: '/project' },
      { title: '测试与运维', link: '/devops' },
      { title: '资源', link: '/common' },
      { title: '微前端', link: '/app'}
    ],
    // 需要特殊配置的目录
    // sidebar: {
    //   '/project/react/qa': [
    //     { title: '常见问题', children: [] }
    //   ],
    //   '/project/react/source': [
    //     { title: '框架', children: [] }
    //   ]
    // },
    footer: 'UCloud 云通信前端团队'
  },
  history: {
    type: 'browser',
  },
  locales: [{ id: 'zh-CN', name: '中文' }],
  outputPath: 'dist',
  base: '/frontend-knowledge/',
  publicPath: '/frontend-knowledge/',
  exportStatic: {},
  resolve: {
    docDirs: ['docs'], // 2.0 默认值
    // atomDirs: [{ type: 'component', dir: 'src' }], // 2.0 默认值
  },
  styles: [`
    .dumi-default-toc > li > a.active {
      border-inline-start-width: 3px !important;
    }
  `],
  analytics: {
    baidu: '6f17617aa4544e964fa0175726c2a460',
  },
  // scripts: [
  //   {
  //     src: "https://giscus.app/client.js",
  //     "data-repo": "UMCloud-FE/frontend-knowledge",
  //     "data-repo-id": "R_kgDOIYRu5Q",
  //     "data-category": "Announcements",
  //     "data-category-id": "DIC_kwDOIYRu5c4CU1sl",
  //     "data-mapping": "pathname",
  //     "data-strict": "0",
  //     "data-reactions-enabled": "1",
  //     "data-emit-metadata": "1",
  //     "data-input-position": "bottom",
  //     "data-theme=": "light_tritanopia",
  //     "data-lang": "zh-CN",
  //     "data-loading": "lazy",
  //     "crossorigin": "anonymous",
  //     "async": true
  //   }
  // ],
});
