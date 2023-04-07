---
title: 好用的第三方 Hooks
order: 4

group:
  title: 框架
  order: 1
---

## a hooks

- [好用的 hooks 库](https://ahooks.js.org/hooks/use-throttle-fn)

---

```jsx
/**
 * compact: true
 * inline: true
 */
import React from 'react';
import Giscus from '@giscus/react';
import { usePrefersColor } from 'dumi';

export default function Main() {
  const [color] = usePrefersColor();

  return (
    <section style={{ marginTop: '32px' }}>
      <Giscus
        id="comments"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        loading="lazy"
        src="https://giscus.app/client.js"
        repo="UMCloud-FE/frontend-knowledge"
        repoId="R_kgDOIYRu5Q"
        category="Announcements"
        categoryId="DIC_kwDOIYRu5c4CU1sl"
        mapping="URL"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="1"
        inputPosition="bottom"
        theme="light_tritanopia"
        lang="zh-CN"
        loading="lazy"
        crossorigin="anonymous"
        async={true}
        theme={color === 'dark' ? 'dark_tritanopia' : 'light_tritanopia'}
      />
    </section>
  );
}
```
