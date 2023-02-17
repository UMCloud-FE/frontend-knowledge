# 如何开发 loader

## 一、loader 简单介绍

### 1、loader 是什么

loaders 将 webpack 不支持的文件类型转换成有效的模块，并可以加入依赖图中。
loader 就是一个 javascript 的模块函数，用来将源代码转化成特定的资源

```js
module.exports = (resource) => {
  return resource;
};
```

### 2、常见的 loader

| 名称         | 描述                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| raw-loader   | 读取文件内容，过滤特殊字符，添加导出语句，将文件转化为 javascript 模块 |
| babel-loader | 转化 ES6、ES7 等 JS 新特性和语法                                       |
| style-loader | 讲 css 文件插入 html 中                                                |
| css-loader   | 处理 css 文件中的 url 和 import 路径问题                               |

### 3、如何配置 loader

```js
module.exports = {
  output: {
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

## 二、loader-runner 调试 loader

[loader-runner](https://github.com/webpack/loader-runner)

```js
const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders(
  {
    resource: path.resolve('src/index.js'),
    loaders: [path.resolve('loader/index.js')],
    context: { minimize: true },
    // processResource: (loaderContext, resourcePath, callback) => {
    // console.log("loaderContext", loaderContext, resourcePath, callback)
    // },
    readResource: fs.readFile.bind(fs),
  },
  function (err, result) {
    // console.log("err", err, result)
    err ? console.log(err) : console.log(result);
  },
);
```

## 三、同步 loader 和异步 loader

```js
// 同步执行，返回转化后的文件
module.exports = (context) => {
  return context;
};

// 异步执行，返回更多信息
module.exports = (context) => {
  this.callback(null, context, sourceMap, ast);
};
```

## 四、常见 loader 代码实践

### 1、raw-loader

```js
module.exports = (source) => {
  const { esModule } = this.getOptions();
  const content = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  const isEsModule = typeof esModule !== 'undefined' ? esModule : true;
  return `{${
    isEsModule ? 'default.export = ' : 'module.exports = '
  } ${content}}`;
};
```

### 2、babel-loader

```js
const core = require('@babel/core');

module.exports = function (resource) {
  const options = this.getOptions();
  const { code, map, ast } = core.transformSync(resource, options);
  console.log('code', code);
  console.log('map', map);
  console.log('ast', ast);
  this.callback(null, code, map, ast);
};
```

### 3、markdown-loader

```js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

module.exports = function (source) {
  const content = md.render(source);
  const code = `module.exports = ${JSON.stringify(content)}`;
  return code;
};
```

## 五、webpack 执行的生命周期

- 1、初始化参数：webpack 读取 webpack 配置，得到最终的初始化参数
- 2、开始编译：webpack 根据初始化参数，实例化 compiler 对象，并加载 plugin 配置，执行 runner 方法
- 3、确定入口：找到 entry 所有的入口文件
- 4、编译模块：从入口文件开始，调用 loader 开始进行文件编译，并依次找到依赖文件，进行编译
- 5、编译完成：此时得到 webpack 编译生成对应的资源和文件的依赖关系
- 6、输出资源：根据入口文件和文件的依赖关系，组装成包含多个模块的 chunk，然后将 chunk 生成一个个文件，加入输出列表，
- 7、输出完成：根据 webpack 的输出配置，通过文件系统将文件内容输出
  在 compiler 执行过程中，会有不同的钩子函数，如果存在对应的插件，plugin 会执行对应的逻辑，并且可以调用 webpack 的 api 修改资源文件
