# 概览页

> 寻求突破，不断尝试，保持耐心，持续积累

## 文档说明

作为持续积累的一个途径，保持快速迭代和持续更新，问题整理。

- 一个问题
- 一道题目
- 一个开发记录
- 一个想法
- 一个技术视频
- 一个故事
- 前沿技术
- ...

持续产出前端技术相关的内容

问问自己：**这周个人产出和价值是什么？**

---

```jsx
/**
 * compact: true
 * inline: true
 */
import React from 'react';

export default () => (
  <h1>
    <div
      style={{
        background: `url(https://img.shields.io/github/stars/UMCloud-FE/frontend-knowledge?style=social) 10px 10px no-repeat`,
        height: '100px',
        lineHeight: '100px',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '10px',
      }}
      onClick={() =>
        window.open(
          'https://github.com/UMCloud-FE/frontend-knowledge',
          '_blank',
        )
      }
    >
      {'觉得作者写的还行的，可以给一个小星星哦！'}
    </div>
  </h1>
);
```
