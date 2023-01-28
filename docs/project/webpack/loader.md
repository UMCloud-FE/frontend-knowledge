---
title: Loader
order: 1

group:
  title: Webpack
  order: 0
---

# loader 使用

webpack 作为一个构建工具，可以将各种资源打包成通用模块，loader 是 webpack 的一个个功能函数，主要用来处理各种资源，webpack 只能编译 js,json，但前端各种资源模块都有：css、less、jsx、ts、图片等，需要使用 loader 进行处理后，交给 webpack 编译

## 一、loader 的使用方法

### 1、配置文件，modules.rules

```js
module.exports = {
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, './app')],
        exclude: [path.resolve(__dirname, './test')],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          {
            loader: 'less-loader',
            enforce: 'pre',
          },
        ],
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        loader: 'test-json-loader',
      },
    ],
  },
};
```

### 2、内联方式配置

```js
import Styles from '!style-loader!css-loader?modules!./styles.css';
```

**使用构建失败，modules 值未生效，后续测试通过后，补充**

### 3、字段解读

#### test

正则，匹配文件类型

#### use

使用的 loader，可以是字符串或者数组，

解析规则：默认通过 npm install 安装 node_modules 解析，可以自定义配置

1、path.resolve(\_\_dirname, './webpack/index.js')

2、resolveLoader

```js
resolveLoader: {
  modules: ['node_modules', path.resolve(__dirname, 'loaders')];
}
```

3、npm link

#### enforce

执行的顺序，默认 normal, 其他值：'pre' | 'post'

Normal 阶段的执行顺序：pre、normal、inline、post

#### include、exclude

选择包含和排除的资源文件

#### type

可设置值: 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/sync' | 'webassembly/async' | 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'

用来声明 loader 解析的文件类型，防止误解

新增模块，替换原有的 loader

| type                   | 替换 loader             |                      |
| ---------------------- | ----------------------- | -------------------- |
| 'asset/source'         | raw-loader              | 导出资源源代码       |
| 'asset/resource'       | file-loader             | 输出文件             |
| 'asset','asset/inline' | url-loader              | 解析 url 为 data URI |
| 'asset'                | file-loader, url-loader | 自动选择             |

**如果还要使用原来的 loader，要将 type 设置为`javascript/auto`**

## 二、loader 的特性

1、执行顺序

从右到左，从下到上，还和 enforce 有关

2、同步异步调用

loader 通过 this，实现上下文的获取获取，`this.query`，`this.getOptions()`等

```js
// 同步调用
module.exports = function (source) {
  const { name } = this.getOptions();
  const res = source.replace('test', name);
  return res;
};
// 异步调用
module.exports = function (resource) {
  const content = source.replace('test', 'production');
  this.callback(null, content);
  return;
};
```

this.callback 参数说明

```js
this.callback(
    // 当无法转换源内容时，给 Webpack 返回一个 Error
    err: Error | null,
    // 源内容转换后的内容
    content: string | Buffer,
    // 用于把转换后的内容得出原内容的 Source Map，方便调试
    sourceMap?: SourceMap,
    // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回，
    // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
    abstractSyntaxTree?: AST
);
```

3、loader 应该遵循的规则

- 职责单一
- 链式调用，按顺序将 loader 返回值给下一个 loader 使用
- 无状态
- 可以同步也可以异步

## 三、简单的核心 loader 实现

style-loader

```js
module.exports = function (source) {
  return `const styleTag = document.createElement('style');
        styleTag.innerHTML = ${source};
        document.head.appendChild(styleTag);
    `;
};
```

css-loader

```js
module.exports = function (source) {
  return JSON.stringify(source);
};
```

less-loader

```js
const less = require('less');
module.exports = function (source) {
  less.render(source, (error, output) => {
    let { css } = output;
    this.callback(error, css);
  });
};
```
